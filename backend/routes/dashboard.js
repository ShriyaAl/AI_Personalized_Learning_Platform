import express from 'express';
import { createClient } from '@supabase/supabase-js';

const dashboardRouter = express.Router();

if (!process.env.DATABASE_URL || !process.env.DATABASE_KEY) {
  console.error("Missing Supabase credentials in .env");
}

const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_KEY
);

// Student Dashboard Data
dashboardRouter.get('/student/courses', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .limit(3);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ error: error.message });
  }
});

// Teacher Dashboard Data
dashboardRouter.get('/teacher/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    // 1. Courses Count
    const { data: coursesData, error: coursesError } = await supabase
      .from("courses")
      .select("id")
      .eq("teacher_id", uid);
    if (coursesError) throw coursesError;

    // 2. Student Count
    const { count: studentCount, error: studentError } = await supabase
      .from("enrollments")
      .select("*", { count: 'exact', head: true });
    if (studentError) throw studentError;

    // 3. Groups Count
    const { data: groupsData, error: groupsError } = await supabase
      .from("groups")
      .select("id")
      .eq("teacher_id", uid);
    if (groupsError) throw groupsError;

    // 4. Notifications
    const { data: notifData, error: notifError } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(5);
    if (notifError) throw notifError;

    res.json({
      stats: {
        courses: coursesData?.length || 0,
        students: studentCount || 0,
        groups: groupsData?.length || 0
      },
      notifications: notifData || []
    });
  } catch (error) {
    console.error("Error fetching teacher dashboard data:", error);
    res.status(500).json({ error: error.message });
  }
});

export default dashboardRouter;
