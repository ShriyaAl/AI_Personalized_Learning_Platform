import express from 'express';
import { supabaseAdmin } from '../db/supabase.js';

const dashboardRouter = express.Router();

const getErrorResponse = (error) => {
  if (error?.message?.includes('fetch failed')) {
    return {
      status: 503,
      body: { error: 'Database unavailable. Check internet connection and Supabase status.' },
    };
  }
  return { status: 500, body: { error: error?.message || 'Internal Server Error' } };
};

// Student Dashboard Data
dashboardRouter.get('/student/courses', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*')
      .limit(3);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    const { status, body } = getErrorResponse(error);
    res.status(status).json(body);
  }
});

// Teacher Dashboard Data
dashboardRouter.get('/teacher/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    // 1. Courses Count
    const { data: coursesData, error: coursesError } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('teacher_id', uid);
    if (coursesError) throw coursesError;

    // 2. Student Count
    const { count: studentCount, error: studentError } = await supabaseAdmin
      .from('enrollments')
      .select('*', { count: 'exact', head: true });
    if (studentError) throw studentError;

    // 3. Groups Count
    const { data: groupsData, error: groupsError } = await supabaseAdmin
      .from('groups')
      .select('id')
      .eq('teacher_id', uid);
    if (groupsError) throw groupsError;

    // 4. Notifications
    const { data: notifData, error: notifError } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(5);
    if (notifError) throw notifError;

    res.json({
      stats: {
        courses: coursesData?.length || 0,
        students: studentCount || 0,
        groups: groupsData?.length || 0,
      },
      notifications: notifData || [],
    });
  } catch (error) {
    console.error('Error fetching teacher dashboard data:', error);
    const { status, body } = getErrorResponse(error);
    res.status(status).json(body);
  }
});

export default dashboardRouter;
