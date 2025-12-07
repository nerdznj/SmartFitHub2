
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserProfile, TrainingPlan } from '../models';
import { generateWorkoutPlan } from '../services/aiService';

export const createAiPlan = async (req: any, res: any) => {
  try {
    const userId = req.user!.id;
    const profile = await UserProfile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(400).json({ success: false, message: 'پروفایل فیزیکی ناقص است.' });
    }

    const generatedContent = await generateWorkoutPlan(profile);

    const plan = await TrainingPlan.create({
      userId,
      goal: profile.fitnessGoal,
      content: generatedContent || '{}',
      status: 'active'
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyPlan = async (req: any, res: any) => {
  try {
    const plan = await TrainingPlan.findOne({ 
      where: { userId: req.user!.id, status: 'active' },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: plan });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
