import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const aiRouter = express.Router();

// Verify GEMINI_API_KEY exists
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is not defined in backend .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

// 1. Quiz Generation Endpoint
aiRouter.post('/quiz', async (req, res) => {
  const { subModuleId, courseId, diff, materialContext } = req.body;
  if (!subModuleId || !courseId || !diff) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const contextSection = materialContext
      ? `\n      The student studied this material:\n      ---\n      ${materialContext.slice(0, 3000)}\n      ---\n      Generate ALL 5 questions based STRICTLY on this material content above.`
      : `\n      Topic: ${subModuleId}. Course: ${courseId}.`;

    console.log(`📝 Quiz generation: ${materialContext ? '✅ Using MATERIAL CONTENT (' + materialContext.length + ' chars)' : '⚠️  Using topic name only (no material)'}`);

    const prompt = `
      You are an expert quiz generator. Generate a 5-question multiple-choice mastery check for a student.
      Difficulty Level: ${diff} — ${diff === 'HARD' ? 'Advanced application and deep theory.' : diff === 'MEDIUM' ? 'Standard comprehension and core facts.' : 'Basic definitions and simple concepts.'}
      ${contextSection}

      Rules:
      - Generate EXACTLY 5 questions.
      - Questions must be specific and meaningful, NOT generic.
      - Each option should be plausible (no obvious wrong answers).
      - Return ONLY valid JSON, no markdown, no backticks.
      
      Format:
      [
        {
          "question": "Question text?",
          "options": ["A", "B", "C", "D"],
          "correct": 0,
          "explanation": "Brief explanation of why the answer is correct."
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
    const data = JSON.parse(text);
    
    res.json(data);
  } catch (error) {
    console.error("Quiz Generation Failed:", error);
    
    // FALLBACK: Only serve fallback on genuine API quota/rate-limit errors
    if (error.status === 429 || error.message?.includes("quota") || error.message?.includes("rate")) {
      console.log("Serving fallback quiz due to API quota or error.");
      const fallbackQuiz = [
        {
          "question": `What is a core component of ${req.body.subModuleId || 'this submodule'}?`,
          "options": ["Basic Feature A", "Core Principle B", "Advanced Concept C", "Technical Detail D"],
          "correct": 1,
          "explanation": `This question explores the core principles of ${req.body.subModuleId}. (Fallback quiz served due to AI rate limit)`
        },
        {
          "question": `Which of the following describes the goal of ${req.body.courseId || 'this course'}?`,
          "options": ["To simplify learning", "To provide advanced tools", "To automate processes", "All of the above"],
          "correct": 3,
          "explanation": "Modern personalized learning aims to provide a comprehensive, multi-faceted approach. (Fallback served)"
        },
        {
          "question": "Personalized learning helps students by...",
          "options": ["Providing fixed schedules", "Adapting to their pace", "Eliminating tests", "None of the above"],
          "correct": 1,
          "explanation": "Adaptive pacing is a hallmark of personalized education. (Fallback served)"
        },
        {
          "question": "What identifies the 'Gap Identification' in learning?",
          "options": ["Determining what the student knows", "Looking for what is yet to be learned", "Finding errors in textbook", "Both A and B"],
          "correct": 3,
          "explanation": "Gap identification is critical for effective personalized learning paths. (Fallback served)"
        },
        {
          "question": "The Feynman Technique is centered around...",
          "options": ["Memorization", "Simplification", "Speed writing", "Group study"],
          "correct": 1,
          "explanation": "The Feynman technique emphasizes explaining complex topics simply. (Fallback served)"
        }
      ];
      return res.json(fallbackQuiz);
    }
    
    res.status(500).json({ error: error.message });
  }
});

// 2. Tutor Analytics & Response Endpoint
aiRouter.post('/tutor', async (req, res) => {
  const { history } = req.body;
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Missing or invalid history array' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Call 1 - Silent gap analysis
    const analysisPrompt = `
      You are an expert biology tutor and learning analyst.
      
      CONTEXT: A student is learning Photosynthesis using the Feynman Technique.
      Analyze their LATEST message in context of the full conversation.

      CONVERSATION HISTORY:
      ${history.map(m => `${m.role}: ${m.text}`).join('\n')}

      PHOTOSYNTHESIS RUBRIC — Key components:
      1. LIGHT_ABSORPTION: Chlorophyll absorbs light energy in chloroplasts
      2. ENERGY_CONVERSION: Light energy → chemical energy (ATP + NADPH) via light-dependent reactions
      3. WATER_SPLITTING: Water molecules split, releasing oxygen as byproduct
      4. CARBON_FIXATION: CO2 fixed into organic molecules via Calvin Cycle
      5. GLUCOSE_SYNTHESIS: Chemical energy used to produce glucose

      CLASSIFY each component as: PRESENT | PARTIAL | MISSING | MISCONCEPTION

      DETECT the message type:
      - EXPLANATION: Student is explaining photosynthesis
      - QUESTION: Student is asking about something they don't understand
      - FOLLOW_UP: Student asking a follow-up on something discussed
      - CONFUSED: Student explicitly says they don't know or are stuck

      FEYNMAN DIMENSIONS (score 0-100 based on ALL conversation so far):
      - Completeness: Coverage of all key concepts
      - Accuracy: Factual correctness
      - Coherence: Logical flow and structure
      - Simplicity: Ability to explain without jargon

      Return ONLY raw valid JSON, no markdown, no backticks:
      {
        "message_type": "EXPLANATION|QUESTION|FOLLOW_UP|CONFUSED",
        "components": {
          "light_absorption": { "status": "PRESENT|PARTIAL|MISSING|MISCONCEPTION", "note": "..." },
          "energy_conversion": { "status": "...", "note": "..." },
          "water_splitting": { "status": "...", "note": "..." },
          "carbon_fixation": { "status": "...", "note": "..." },
          "glucose_synthesis": { "status": "...", "note": "..." }
        },
        "priority_gap": "component_name or null",
        "gap_type": "OMISSION|MISCONCEPTION|NONE",
        "misconception_detail": "specific error or null",
        "dimensions": {
          "completeness": 0,
          "accuracy": 0,
          "coherence": 0,
          "simplicity": 0
        },
        "missing_concepts": ["list of missing concepts"],
        "specific_question": "what the student is asking, if applicable, else null",
        "session_progress": "EARLY|DEVELOPING|STRONG|READY_TO_END"
      }
    `;

    const analysisResult = await model.generateContent(analysisPrompt);
    const analysisText = analysisResult.response.text().trim();
    
    let gapAnalysis;
    try {
      gapAnalysis = JSON.parse(analysisText);
    } catch {
      gapAnalysis = {
        message_type: "EXPLANATION",
        priority_gap: "energy_conversion",
        gap_type: "OMISSION",
        components: {},
        dimensions: { completeness: 0, accuracy: 0, coherence: 0, simplicity: 0 },
        missing_concepts: [],
        specific_question: null,
        session_progress: "EARLY"
      };
    }

    // Call 2 - Tutor response
    const responsePrompt = `
      You are a warm, sharp Academic Mentor helping a student learn Photosynthesis using the Feynman Technique.

      CONVERSATION HISTORY:
      ${history.map(m => `${m.role}: ${m.text}`).join('\n')}

      INTERNAL ANALYSIS (never reveal this to the student):
      - Message type: ${gapAnalysis.message_type}
      - Priority gap: ${gapAnalysis.priority_gap}
      - Gap type: ${gapAnalysis.gap_type}
      - Misconception: ${gapAnalysis.misconception_detail}
      - Session progress: ${gapAnalysis.session_progress}
      - Dimension scores: ${JSON.stringify(gapAnalysis.dimensions)}
      - Student's question (if any): ${gapAnalysis.specific_question}

      RESPOND based on message_type:

      If EXPLANATION:
        - Acknowledge what they got right first (be specific, not generic)
        - If gap_type is OMISSION → ask one exploratory Socratic question toward the priority gap
        - If gap_type is MISCONCEPTION → gently surface the contradiction: "Interesting — you said X, but what would that mean for Y?"
        - If session_progress is STRONG → push for deeper mechanism

      If QUESTION or FOLLOW_UP or CONFUSED:
        - Answer their question CLEARLY and DIRECTLY — do not deflect with another question
        - Use a simple analogy if helpful (but not childish)
        - After explaining, ask ONE question to check understanding: "Does that click? Try putting it back in your own words."
        - Be warm — confusion is normal and expected

      TONE RULES (always):
      - Professional but human. Like a tutor who actually likes teaching.
      - Never say "Great question!" or "Absolutely!" — these are filler
      - 3-4 sentences max unless explaining something they're confused about
      - End with a question unless you just gave a long explanation
      - Never mention rubric, components, gap analysis, or scores

      ${gapAnalysis.session_progress === "READY_TO_END" ?
        'At the end of your response, add: "Feeling confident? Type done when you want your full Feynman breakdown! 🎯"' : ''}
    `;

    const responseResult = await model.generateContent(responsePrompt);
    const text = responseResult.response.text();

    res.json({ gapAnalysis, text });

  } catch (error) {
    console.error("Tutor Analysis Failed:", error);
    
    // FALLBACK: Return a generic tutor response to bypass quota limits
    if (error.status === 429 || error.message?.includes("quota") || error.message?.includes("rate")) {
      console.log("Serving fallback tutor response due to API quota or rate limit.");
      const fallbackResponse = {
        gapAnalysis: {
          message_type: "EXPLANATION",
          priority_gap: "GENERAL_COMPREHENSION",
          gap_type: "NONE",
          misconception_detail: null,
          dimensions: { completeness: 70, accuracy: 80, coherence: 75, simplicity: 90 },
          missing_concepts: [],
          specific_question: null,
          session_progress: "DEVELOPING"
        },
        text: "I'm having a little trouble doing a deep analysis right now because our brain (AI) is quite busy! But don't let that stop you. You're doing a great job explaining these concepts. Could you tell me a bit more about how this connects to the bigger picture?"
      };
      return res.json(fallbackResponse);
    }
    
    res.status(500).json({ error: error.message });
  }
});

// 3. Session End Endpoint
aiRouter.post('/tutor/summary', async (req, res) => {
  const { history } = req.body;
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: 'Missing or invalid history array' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const summaryPrompt = `
      You are an expert learning analyst. A student just completed a Feynman Technique session on Photosynthesis.

      FULL CONVERSATION:
      ${history.map(m => `${m.role}: ${m.text}`).join('\n')}

      Generate a final Feynman Assessment. Return ONLY raw valid JSON, no markdown, no backticks:
      {
        "dimensions": {
          "completeness": 0,
          "accuracy": 0,
          "coherence": 0,
          "simplicity": 0
        },
        "overall_score": 0,
        "strengths": ["specific thing they did well", "another strength"],
        "misconceptions": ["specific misconception if any"],
        "missing_concepts": ["concepts never covered"],
        "personalized_feedback": {
          "lowest_dimension": "completeness|accuracy|coherence|simplicity",
          "advice": "specific, actionable advice based on their weakest dimension"
        },
        "next_steps": ["specific action 1", "specific action 2"]
      }

      Scoring guide:
      - Completeness: Did they cover all 5 components? (light absorption, energy conversion, water splitting, carbon fixation, glucose synthesis)
      - Accuracy: Were their facts correct?
      - Coherence: Did the explanation flow logically?
      - Simplicity: Did they explain without relying on jargon?
    `;

    const summaryResult = await model.generateContent(summaryPrompt);
    const summaryText = summaryResult.response.text().trim();

    let finalAssessment;
    try {
      finalAssessment = JSON.parse(summaryText);
    } catch {
      finalAssessment = null;
    }

    res.json({ finalAssessment });

  } catch (error) {
    console.error("Session Summary Failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Generate Course Roadmap Endpoint
aiRouter.post('/generate-roadmap', async (req, res) => {
  const { materials, fileNames } = req.body;
  
  if (!materials && (!fileNames || fileNames.length === 0)) {
    return res.status(400).json({ error: 'Missing materials or fileNames' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are an expert curriculum designer. Your task is to generate a structured learning roadmap.
      
      SYLLABUS PROVIDED BY TEACHER:
      ${materials || 'No specific syllabus provided.'}

      UPLOADED MATERIAL FILES:
      ${fileNames && fileNames.length > 0 ? fileNames.join(', ') : 'No files uploaded.'}

      STRICT RULES:
      1. Extract SPECIFIC TOPICS from the syllabus to create module and lesson titles. Do NOT use generic names like "Module 1: Getting Started" or "Core Concepts".
      2. Each module title MUST be a real topic from the syllabus (e.g. "IoT Protocols & Communication", "Sensors and Actuators", etc.)
      3. Each lesson title must be a specific sub-topic from the syllabus.
      4. Create 3-6 modules based on the syllabus structure. Each module should have 2-4 lessons.
      5. Match each uploaded file to the most relevant module/lesson by content inference from the filename.
      6. The "content_url" for file-based lessons MUST be the EXACT filename provided. For syllabus-only lessons, use null.
      7. Return ONLY valid JSON array. No markdown, no backticks, no explanation.

      JSON FORMAT:
      [
        {
          "title": "Specific Topic Name from Syllabus",
          "lessons": [
            {
              "title": "Specific Sub-Topic",
              "type": "doc",
              "content_url": "filename.pdf or null"
            }
          ]
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parsing error on roadmap:", text);
      return res.status(500).json({ error: "Failed to parse AI output into JSON" });
    }
    
    res.json(data);
  } catch (error) {
    console.error("Roadmap Generation Failed:", error);
    
    // Only use fallback for genuine quota/rate-limit errors
    if (error.status === 429 || error.message?.includes("quota") || error.message?.includes("rate")) {
      console.log("Serving fallback roadmap due to API quota limit.");

      // Build a smarter fallback from the actual syllabus text
      const syllabusTopics = (materials || '')
        .split(/[,\n]/)
        .map(t => t.trim())
        .filter(t => t.length > 5 && t.length < 60)
        .slice(0, 6);

      const fallbackModules = syllabusTopics.length > 0
        ? syllabusTopics.map((topic, i) => ({
            title: topic.replace(/^\d+\.\s*/, '').trim(),
            lessons: [
              { title: `Overview of ${topic.replace(/^\d+\.\s*/, '').trim()}`, type: "doc", content_url: null },
              ...(i === 0 && (req.body.fileNames || []).length > 0 
                ? (req.body.fileNames || []).map(fn => ({
                    title: fn.split('.').slice(0, -1).join('.').replace(/[-_]/g, ' '),
                    type: "doc",
                    content_url: fn
                  }))
                : [])
            ]
          }))
        : [
            {
              title: "Introduction & Overview",
              lessons: [
                { title: "Course Introduction", type: "doc", content_url: null },
                ...(req.body.fileNames || []).map(fn => ({
                  title: fn.split('.').slice(0, -1).join('.').replace(/[-_]/g, ' '),
                  type: "doc",
                  content_url: fn
                }))
              ]
            },
            {
              title: "Core Concepts",
              lessons: [
                { title: "Fundamental Principles", type: "doc", content_url: null }
              ]
            }
          ];

      return res.json(fallbackModules);
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Helper to try multiple model names — skips models that are unavailable OR rate-limited
async function generateWithFallback(genAI, prompt, primaryModel = "gemini-2.5-flash") {
  // Ordered by preference: newest/most-quota-generous first
  const modelsToTry = [
    primaryModel,
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b",
    "gemini-pro",
  ].filter((m, i, arr) => arr.indexOf(m) === i); // deduplicate

  let lastError;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Attempting AI call with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      console.log(`✅ AI call succeeded with model: ${modelName}`);
      return result;
    } catch (err) {
      lastError = err;
      const isNotFound = err.status === 404 || err.message?.toLowerCase().includes('not found');
      const isQuota = err.status === 429 || err.message?.toLowerCase().includes('quota') || err.message?.toLowerCase().includes('rate');
      const isUnavailable = err.status === 503 || err.message?.toLowerCase().includes('unavailable');

      if (isNotFound || isQuota || isUnavailable) {
        console.warn(`⚠️ Model ${modelName} failed (${err.status || 'unknown status'}): ${err.message?.slice(0, 80)}. Trying next...`);
        continue;
      }
      // For auth errors (401) or truly unexpected errors, stop immediately
      console.error(`❌ Non-retryable error on model ${modelName}:`, err.message);
      throw err;
    }
  }
  throw lastError;
}

// 5. Dynamic Lesson Tutor — Feynman approach for ANY lesson topic
aiRouter.post('/lesson-tutor', async (req, res) => {
  const { history, lessonTitle, materialContext } = req.body;
  if (!history || !Array.isArray(history) || !lessonTitle) {
    return res.status(400).json({ error: 'Missing required fields: history, lessonTitle' });
  }

  try {
    const contextBlock = materialContext
      ? `\n      LESSON MATERIAL (key facts the student should know):\n      ---\n      ${materialContext.slice(0, 3000)}\n      ---`
      : `\n      Note: No specific material was provided. Use your knowledge of "${lessonTitle}" to assess the explanation.`;

    // Call 1 — Silent gap analysis
    const analysisPrompt = `
      You are an expert learning analyst using the Feynman Technique.

      TOPIC: "${lessonTitle}"
      ${contextBlock}

      STUDENT CONVERSATION SO FAR:
      ${history.map(m => `${m.role}: ${m.text}`).join('\n')}

      Your job: analyze the student's LATEST explanation against what an ideal explanation of "${lessonTitle}" should cover.

      DETECT message_type:
      - EXPLANATION: student is explaining the topic
      - QUESTION: student is asking something
      - FOLLOW_UP: student replies to your question
      - CONFUSED: student says they don't know or are stuck

      FEYNMAN DIMENSIONS (0–100, based on full conversation so far):
      - Completeness: did they cover all the key concepts?
      - Accuracy: are the facts correct?
      - Coherence: does it flow logically?
      - Simplicity: can they explain without jargon?

      IDENTIFY: The single most important concept they have not explained yet (priority_gap).

      Return ONLY raw valid JSON (no markdown, no backticks):
      {
        "message_type": "EXPLANATION|QUESTION|FOLLOW_UP|CONFUSED",
        "priority_gap": "short concept name or null",
        "gap_type": "OMISSION|MISCONCEPTION|NONE",
        "misconception_detail": "specific error string or null",
        "dimensions": { "completeness": 0, "accuracy": 0, "coherence": 0, "simplicity": 0 },
        "missing_concepts": ["concept 1", "concept 2"],
        "specific_question": "what student is asking, or null",
        "session_progress": "EARLY|DEVELOPING|STRONG|READY_TO_END"
      }
    `;

    // Use fallback helper for analysis
    const analysisResult = await generateWithFallback(genAI, analysisPrompt);
    const analysisText = analysisResult.response.text().trim().replace(/```json/g, '').replace(/```/g, '');

    let gapAnalysis;
    try {
      gapAnalysis = JSON.parse(analysisText);
    } catch {
      gapAnalysis = {
        message_type: 'EXPLANATION',
        priority_gap: null,
        gap_type: 'NONE',
        misconception_detail: null,
        dimensions: { completeness: 40, accuracy: 60, coherence: 50, simplicity: 50 },
        missing_concepts: [],
        specific_question: null,
        session_progress: 'EARLY'
      };
    }

    // Call 2 — Tutor response
    const responsePrompt = `
      You are a warm, expert Academic Mentor helping a student learn "${lessonTitle}" using the Feynman Technique.
      The student was asked to explain "${lessonTitle}" as if to a 10-year-old.

      CONVERSATION SO FAR:
      ${history.map(m => `${m.role}: ${m.text}`).join('\n')}

      INTERNAL ANALYSIS (never reveal this):
      - Message type: ${gapAnalysis.message_type}
      - Priority gap: ${gapAnalysis.priority_gap}
      - Gap type: ${gapAnalysis.gap_type}
      - Misconception: ${gapAnalysis.misconception_detail}
      - Session progress: ${gapAnalysis.session_progress}

      RESPOND based on message_type:

      If EXPLANATION:
        - Specifically acknowledge what they explained well
        - If gap_type is OMISSION → ask ONE Socratic question to probe the priority gap. Don't explain it yourself.
        - If gap_type is MISCONCEPTION → surface the contradiction gently: "Interesting — you said X. What happens to Y then?"
        - If session_progress is STRONG → push for deeper mechanism or a real-world example

      If QUESTION or FOLLOW_UP or CONFUSED:
        - Answer CLEARLY and DIRECTLY with a helpful analogy
        - After explaining, ask ONE check question: "Does that make sense? Try explaining it back."

      TONE:
      - Sharp, warm, like a tutor who cares
      - 3-4 sentences max (unless clarifying confusion)
      - Never say "Great!" or "Absolutely!" — avoid filler praise
      - Never mention rubric, scores, or analysis

      ${gapAnalysis.session_progress === 'READY_TO_END'
        ? 'At the end of your response add: "You\'re getting there! Type \'done\' when you feel confident for your full Feynman breakdown. 🎯"'
        : ''}
    `;

    const responseResult = await generateWithFallback(genAI, responsePrompt);
    const text = responseResult.response.text();

    res.json({ gapAnalysis, text });

  } catch (error) {
    console.error('❌ Lesson Tutor Error (all models exhausted):', error.status, error.message);

    // If genuinely all models are rate-limited / unavailable, return a usable fallback
    // so the chat UI doesn't break. Return 200 so the frontend can keep running.
    const isQuotaOrUnavailable = error.status === 429 || error.status === 503
      || error.message?.toLowerCase().includes('quota')
      || error.message?.toLowerCase().includes('rate')
      || error.message?.toLowerCase().includes('unavailable');

    if (isQuotaOrUnavailable) {
      return res.json({
        gapAnalysis: null,
        text: "I'm having trouble connecting to the AI right now — the service may be rate-limited. Keep going with your explanation and I'll catch up! 🔄"
      });
    }

    // Auth errors, invalid API key, etc. — still return 500 so they're visible
    res.status(500).json({ error: `AI Tutor Error: ${error.message}` });
  }
});


// 6. Dynamic Lesson Tutor Summary — generates Feynman breakdown for any lesson topic
aiRouter.post('/lesson-tutor/summary', async (req, res) => {
  const { history, lessonTitle } = req.body;
  if (!history || !Array.isArray(history) || !lessonTitle) {
    return res.status(400).json({ error: 'Missing required fields: history, lessonTitle' });
  }

  try {
    const summaryPrompt = `
      You are an expert learning analyst. A student just completed a Feynman Technique session on "${lessonTitle}".

      FULL CONVERSATION:
      ${history.map(m => `${m.role}: ${m.text}`).join('\n')}

      Generate a final Feynman Assessment for the topic "${lessonTitle}". Return ONLY raw valid JSON, no markdown, no backticks:
      {
        "dimensions": {
          "completeness": 0,
          "accuracy": 0,
          "coherence": 0,
          "simplicity": 0
        },
        "overall_score": 0,
        "strengths": ["specific thing they did well", "another strength"],
        "misconceptions": ["specific misconception if any"],
        "missing_concepts": ["concepts never covered"],
        "personalized_feedback": {
          "lowest_dimension": "completeness|accuracy|coherence|simplicity",
          "advice": "specific, actionable advice based on their weakest dimension"
        },
        "next_steps": ["specific action 1", "specific action 2"]
      }

      Scoring guide for "${lessonTitle}":
      - Completeness: Did they cover the core concepts of this topic?
      - Accuracy: Were their facts about "${lessonTitle}" correct?
      - Coherence: Did the explanation flow logically?
      - Simplicity: Did they explain without relying on jargon?
    `;

    const summaryResult = await generateWithFallback(genAI, summaryPrompt);
    const summaryText = summaryResult.response.text().trim().replace(/```json/g, '').replace(/```/g, '');

    let finalAssessment;
    try {
      finalAssessment = JSON.parse(summaryText);
    } catch {
      finalAssessment = null;
    }

    res.json({ finalAssessment });

  } catch (error) {
    console.error('❌ Lesson Tutor Summary Error:', error);
    res.status(500).json({ error: `Summary Error: ${error.message}` });
  }
});


export default aiRouter;

