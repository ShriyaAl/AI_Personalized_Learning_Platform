import { adminDb } from '../db/firebaseAdmin.js';

export const getStreaks = async (req, res, next) => {
  try {
    const doc = await adminDb.collection("streaks").doc(req.params.userId).get();
    res.json(doc.exists ? doc.data() : { streakCount: 0, xp: 0, lightning: 0 });
  } catch (err) { next(err); }
};

export const createAiSession = async (req, res, next) => {
  try {
    const sessionData = {
      userId: req.body.userId,
      courseId: req.body.courseId,
      title: req.body.title || "New Session",
      status: "active",
      startedAt: new Date()
    };
    const docRef = await adminDb.collection("sessions").add(sessionData);
    res.json({ id: docRef.id, ...sessionData });
  } catch (err) { next(err); }
};