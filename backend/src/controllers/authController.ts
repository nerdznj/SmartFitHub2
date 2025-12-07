
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Wallet, UserProfile } from '../models';
import { sequelize } from '../config/database';

export const register = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { phone, password, fullName, email, ...profileData } = req.body;

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'شماره تلفن تکراری است' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      phone,
      email,
      password: hashedPassword,
      fullName
    }, { transaction: t });

    // Create Wallet
    await Wallet.create({ userId: user.id, balance: 0 }, { transaction: t });

    // Create Profile
    await UserProfile.create({
      userId: user.id,
      ...profileData
    }, { transaction: t });

    await t.commit();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, fullName: user.fullName, role: user.role },
        token
      }
    });
  } catch (error: any) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    
    // Allow login with phone or email
    const user = await User.findOne({
      where: sequelize.or({ phone: identifier }, { email: identifier })
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'اطلاعات ورود نادرست است' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({
      success: true,
      data: {
        user: { id: user.id, fullName: user.fullName, role: user.role },
        token
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
