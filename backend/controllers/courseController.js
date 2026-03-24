import { supabase } from '../db/supabase.js';

export const getAllCourses = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("users").select("*").eq("uid", req.params.uid).single();
    if (error) throw error;
    res.json(data);
  } catch (err) { next(err); }
};