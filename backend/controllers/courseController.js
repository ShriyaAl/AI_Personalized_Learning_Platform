import { createClient } from '@supabase/supabase-js';
import { processCourseAIContent } from './aiController.js';

const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY);

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

export const getAllCourses = async (req, res) => {
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.params.uid || req.user.uid;
    
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("teacher_id", teacherId); // Remove .single() if it's there!

    if (error) throw error;

    // Even if data is null, send an empty array so the frontend .map works
    res.json(data || []); 
  } catch (error) {
    console.error("Fetch Teacher Courses Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// export const createCourse = async (req, res) => {
//   try {
//     const { title, subject, description, roadmap } = req.body;
//     const teacher_id = req.user.uid; // Securely mapped from token

//     const { data: courseData, error: courseError } = await supabase
//       .from("courses")
//       .insert([{ title, subject, description, teacher_id, is_published: true }])
//       .select();
    
//     if (courseError) throw courseError;
//     const courseId = courseData[0].id;

//     if (roadmap && Array.isArray(roadmap)) {
//       for (let i = 0; i < roadmap.length; i++) {
//         const moduleItem = roadmap[i];
//         const { data: moduleData, error: modErr } = await supabase
//           .from("modules")
//           .insert([{ course_id: courseId, title: moduleItem.title, order_index: i, is_locked: i !== 0 }])
//           .select();
          
//         if (modErr) throw modErr;
//         const moduleId = moduleData[0].id;

//         if (moduleItem.lessons) {
//           const lessons = moduleItem.lessons.map((l, j) => ({
//             module_id: moduleId,
//             title: l.title,
//             type: l.type || 'doc',
//             content_url: l.content_url || null,
//             order_index: j
//           }));
//           const { error: lessonErr } = await supabase.from("lessons").insert(lessons);
//           if (lessonErr) throw lessonErr;
//         }
//       }
//     }
//     processCourseAIContent(courseId).catch(err => console.error("AI Background Error:", err));
//     res.status(201).json(courseData[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const createCourse = async (req, res) => {
  try {
    const { title, subject, description, roadmap } = req.body;
    const teacher_id = req.user.uid;

    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .insert([{ title, subject, description, teacher_id, is_published: true }])
      .select();
    
    if (courseError) throw courseError;
    const courseId = courseData[0].id;

    if (roadmap && Array.isArray(roadmap)) {
      for (let i = 0; i < roadmap.length; i++) {
        const moduleItem = roadmap[i];
        const { data: moduleData, error: modErr } = await supabase
          .from("modules")
          .insert([{ course_id: courseId, title: moduleItem.title, order_index: i }])
          .select();
          
        if (modErr) throw modErr;
        const moduleId = moduleData[0].id;

        if (moduleItem.lessons) {
          const lessons = moduleItem.lessons.map((l, j) => ({
            module_id: moduleId,
            title: l.title,
            type: l.type || 'doc',
            content_url: l.content_url || null,
            order_index: j
          }));
          const { error: lessonErr } = await supabase.from("lessons").insert(lessons);
          if (lessonErr) throw lessonErr;
        }
      }
    }

    // FIX: Fire the AI process in the background, but add a 2-second delay
    // to ensure Supabase indexing has caught up with the new rows.
    (async () => {
       await sleep(2000); 
       processCourseAIContent(courseId).catch(err => 
         console.error("🚨 BACKGROUND AI ERROR:", err)
       );
    })();

    res.status(201).json(courseData[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { error } = await supabase.from("courses").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseRoadmap = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Get all modules for this course
    const { data: modules, error: modError } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (modError) throw modError;

    // 2. Get all lessons for these modules
    const moduleIds = modules.map(m => m.id);
    const { data: lessons, error: lessError } = await supabase
      .from("lessons")
      .select("*")
      .in("module_id", moduleIds)
      .order("order_index", { ascending: true });

    if (lessError) throw lessError;

    // 3. Map lessons into their respective modules
    const roadmap = modules.map(m => ({
      ...m,
      lessons: lessons.filter(l => l.module_id === m.id)
    }));

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

