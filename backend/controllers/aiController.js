import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '../db/supabase.js';
import 'dotenv/config';
import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const JSZip = require('jszip');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper to try multiple model names
 */
async function generateWithFallback(prompt, primaryModel = "gemini-2.5-flash") {
  const modelsToTry = [primaryModel, "gemini-2.5-flash"];
  let lastError;
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result;
    } catch (err) {
      lastError = err;
      if (err.status === 429 || err.status === 503) continue;
      throw err;
    }
  }
  throw lastError;
}

// --- UTILITY: PDF/Docx Extraction from Supabase ---
export const extractTextFromStorage = async (filePath, ext) => {
  const { data, error } = await supabase.storage
    .from('materials')
    .download(filePath);

  if (error) throw new Error(`Storage download failed: ${error.message}`);
  const buffer = Buffer.from(await data.arrayBuffer());

  if (ext === '.pdf') {
    const parsed = await pdf(buffer);
    return parsed.text
      .replace(/(\w)-\n(\w)/g, '$1$2')
      .replace(/(\S)\n(\S)/g, '$1 $2')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }
  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }
  return '';
};

// --- LOGIC: Background Content Generator (Problem 2 Fix) ---
// export const processCourseAIContent = async (courseId) => {
//   console.log(`✨ Starting background generation for Course: ${courseId}`);
//   const { data: lessons, error } = await supabase
//     .from("lessons")
//     .select("*, modules!inner(course_id)")
//     .eq("modules.course_id", courseId)
//     .is("content", null);

//   if (error || !lessons) return;

//   for (const lesson of lessons) {
//     try {
//       let context = "";
//       if (lesson.content_url) {
//         const ext = `.${lesson.content_url.split('.').pop()}`;
//         context = await extractTextFromStorage(lesson.content_url, ext);
//       }

//       const prompt = `Act as an expert personal tutor. Explain "${lesson.title}" concisely (max 400 words). 
//       Context from materials: ${context.slice(0, 5000)}. 
//       Guidelines: Use plain text with bolding, no markdown headers, structure with "Core Concept" and "Real World Example".`;
      
//       const result = await generateWithFallback(prompt);
//       const aiContent = result.response.text();

//       await supabase.from("lessons").update({ content: aiContent }).eq("id", lesson.id);
//       console.log(`✅ Generated content for lesson: ${lesson.title}`);
//     } catch (err) {
//       console.error(`❌ Failed lesson ${lesson.title}:`, err.message);
//     }
//   }
// };

export const processCourseAIContent = async (courseId) => {
  console.log(`✨ AI Job Started for Course: ${courseId}`);

  // 1. Get modules
  const { data: modules, error: modErr } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", courseId);

  if (modErr || !modules?.length) {
    console.error("❌ AI Job Aborted: Could not find modules for course", courseId);
    return;
  }
  const moduleIds = modules.map(m => m.id);

  // 2. Get lessons - BE EXPLICIT with the filter
  const { data: lessons, error: lessonErr } = await supabase
    .from("lessons")
    .select("*")
    .in("module_id", moduleIds)
    .or('content.is.null,content.eq.""'); // Catch both nulls and empty strings

  if (lessonErr) {
    console.error("❌ AI Job Aborted: Error fetching lessons:", lessonErr.message);
    return;
  }

  if (!lessons || lessons.length === 0) {
    console.log("ℹ️ AI Job: No lessons found requiring content generation.");
    return;
  }

  console.log(`📝 Processing ${lessons.length} lessons...`);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  for (const lesson of lessons) {
    try {
      let context = "";
      if (lesson.content_url) {
        const ext = `.${lesson.content_url.split('.').pop()}`.toLowerCase();
        context = await extractTextFromStorage(lesson.content_url, ext);
      }

      const prompt = `Act as an expert tutor. Topic: ${lesson.title}. Context: ${context.slice(0, 5000)}. Format with bolding, no markdown headers. Max 400 words.`;
      
      const result = await model.generateContent(prompt);
      const aiContent = result.response.text();

      // 3. SURFACING THE UPDATE ERROR (Bug 3 Fix)
      const { data: updateData, error: updateErr, status } = await supabase
        .from("lessons")
        .update({ content: aiContent })
        .eq("id", lesson.id)
        .select(); // Calling .select() forces Supabase to return the modified row

      if (updateErr) {
        // This will now clearly show if the 'content' column is missing!
        console.error(`❌ DB UPDATE FAIL for "${lesson.title}":`, {
          message: updateErr.message,
          hint: updateErr.hint,
          details: updateErr.details,
          code: updateErr.code
        });
      } else if (!updateData || updateData.length === 0) {
        console.error(`❌ DB UPDATE FAIL: Row not found or RLS policy blocked update for ${lesson.id}`);
      } else {
        console.log(`✅ Success: Generated content for "${lesson.title}"`);
      }

    } catch (err) {
      console.error(`💥 AI CRASH for lesson ${lesson.title}:`, err.message);
    }
  }
};

// --- LOGIC: Generate Roadmap ---
// export const generateRoadmap = async (req, res) => {
//   const { materials, fileNames } = req.body;
//   try {
//     const prompt = `Generate a structured course roadmap JSON. Syllabus: ${materials}. Files: ${fileNames.join(', ')}.
//     Return ONLY valid JSON array: [{"title": "Module Name", "lessons": [{"title": "Lesson Name", "type": "doc", "content_url": "filename_or_null"}]}]`;

//     const result = await generateWithFallback(prompt);
//     const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
//     res.json(JSON.parse(text));
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const generateRoadmap = async (req, res) => {
  try {
    const { materials, fileNames } = req.body;

    // Safety check for fileNames
    const safeFileNames = Array.isArray(fileNames) ? fileNames : [];

    const prompt = `
      You are an expert curriculum designer. Generate a structured course roadmap.
      
      SYLLABUS/CONTEXT:
      ${materials || 'General introductory course'}

      UPLOADED FILES:
      ${safeFileNames.length > 0 ? safeFileNames.join(', ') : 'None'}

      STRICT RULES:
      1. Return ONLY a valid JSON array. No backticks, no "json" label, no text before or after.
      2. Match content_url to the EXACT filename provided in the list above if it fits a lesson.
      3. Use 3-5 modules with 2-3 lessons each.

      JSON FORMAT:
      [
        {
          "title": "Module Title",
          "lessons": [
            { "title": "Lesson Title", "type": "doc", "content_url": "filename.pdf or null" }
          ]
        }
      ]
    `;

    const result = await generateWithFallback(prompt);
    let text = result.response.text().trim();

    // Cleaning logic to strip markdown code blocks if the AI includes them
    if (text.startsWith("```")) {
      text = text.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
    }

    // Try to parse. If it fails, send a structured error so the frontend knows why.
    try {
      const roadmapData = JSON.parse(text);
      res.json(roadmapData);
    } catch (parseError) {
      console.error("❌ AI JSON Parse Error. Raw Text:", text);
      res.status(500).json({ error: "AI generated invalid formatting. Please try again." });
    }

  } catch (error) {
    console.error("❌ Roadmap Route Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// --- LOGIC: Quiz Generation ---
export const generateQuiz = async (req, res) => {
  const { subModuleId, diff, materialContext } = req.body;
  try {
    const prompt = `Generate a 5-question multiple choice quiz for ${subModuleId}. Difficulty: ${diff}. 
    Context: ${materialContext?.slice(0, 3000)}. Return ONLY JSON.`;
    const result = await generateWithFallback(prompt);
    const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
    res.json(JSON.parse(text));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- LOGIC: Lesson Tutor (Feynman Chat) ---
export const lessonTutor = async (req, res) => {
  const { history, lessonTitle, materialContext } = req.body;
  try {
    const analysisPrompt = `Analyze student explanation for "${lessonTitle}". History: ${JSON.stringify(history)}. Return JSON with gap analysis.`;
    const analysisRes = await generateWithFallback(analysisPrompt);
    const gapAnalysis = JSON.parse(analysisRes.response.text().trim().replace(/```json/g, '').replace(/```/g, ''));

    const responsePrompt = `Academic mentor response for "${lessonTitle}". Analysis: ${JSON.stringify(gapAnalysis)}.`;
    const responseRes = await generateWithFallback(responsePrompt);
    
    res.json({ gapAnalysis, text: responseRes.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- LOGIC: Feynman Summary ---
export const lessonTutorSummary = async (req, res) => {
  const { history, lessonTitle } = req.body;
  try {
    const prompt = `Generate final Feynman assessment for "${lessonTitle}". History: ${JSON.stringify(history)}. Return JSON.`;
    const result = await generateWithFallback(prompt);
    const assessment = JSON.parse(result.response.text().trim().replace(/```json/g, '').replace(/```/g, ''));
    res.json({ finalAssessment: assessment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};