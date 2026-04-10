import { supabaseAdmin } from '../db/supabase.js';

const getErrorResponse = (error) => {
  if (error?.message?.includes('fetch failed')) {
    return {
      status: 503,
      body: { error: 'Database unavailable. Check internet connection and Supabase status.' },
    };
  }
  return { status: 500, body: { error: error?.message || 'Internal Server Error' } };
};

export const getAllCourses = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from("courses").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("getAllCourses failed:", error);
    const { status, body } = getErrorResponse(error);
    res.status(status).json(body);
  }
};

export const getTeacherCourses = async (req, res) => {
  try {
    // SECURE: Use req.user.uid from protect middleware if fetching own courses
    const teacherId = req.params.uid || req.user.uid;
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("teacher_id", teacherId);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("getTeacherCourses failed:", error);
    const { status, body } = getErrorResponse(error);
    res.status(status).json(body);
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, subject, description, roadmap } = req.body;
    const teacher_id = req.user.uid; // Securely mapped from token

    const { data: courseData, error: courseError } = await supabaseAdmin
      .from("courses")
      .insert([{ title, subject, description, teacher_id, is_published: true }])
      .select();
    
    if (courseError) throw courseError;
    const courseId = courseData[0].id;

    if (roadmap && Array.isArray(roadmap)) {
      for (let i = 0; i < roadmap.length; i++) {
        const moduleItem = roadmap[i];
        const { data: moduleData, error: modErr } = await supabaseAdmin
          .from("modules")
          .insert([{ course_id: courseId, title: moduleItem.title, order_index: i, is_locked: i !== 0 }])
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
          const { error: lessonErr } = await supabaseAdmin.from("lessons").insert(lessons);
          if (lessonErr) throw lessonErr;
        }
      }
    }
    res.status(201).json(courseData[0]);
  } catch (error) {
    console.error("createCourse failed:", error);
    const { status, body } = getErrorResponse(error);
    res.status(status).json(body);
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("deleteCourse failed:", error);
    const { status, body } = getErrorResponse(error);
    res.status(status).json(body);
  }
};

export const getCourseRoadmap = async (req, res) => {
  try {
    const { data: modules, error: modError } = await supabaseAdmin
      .from("modules")
      .select("*")
      .eq("course_id", req.params.courseId)
      .order("order_index", { ascending: true });
      
    if (modError) throw modError;
    if (!modules?.length) return res.json([]);

    const { data: lessons, error: lessError } = await supabaseAdmin
      .from("lessons")
      .select("*")
      .in("module_id", modules.map(m => m.id))
      .order("order_index", { ascending: true });
      
    if (lessError) throw lessError;

    res.json(modules.map(m => ({ ...m, lessons: lessons.filter(l => l.module_id === m.id) })));
  } catch (error) {
    console.error("getCourseRoadmap failed:", error);
    const { status, body } = getErrorResponse(error);
    res.status(status).json(body);
  }
};
