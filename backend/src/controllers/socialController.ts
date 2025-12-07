
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { SocialPost, User, UserProfile } from '../models';

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await SocialPost.findAll({
      include: [{ 
        model: User, 
        as: 'author', 
        attributes: ['fullName'],
        include: [{ model: UserProfile, as: 'profile', attributes: ['bodyType'] }]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { content, imageUrl } = req.body;
    const post = await SocialPost.create({
      userId: req.user!.id,
      content,
      imageUrl
    });
    res.status(201).json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
