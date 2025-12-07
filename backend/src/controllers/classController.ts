
import { Request, Response } from 'express';
import { Class, Booking, User, Wallet } from '../models';
import { AuthRequest } from '../middleware/auth';
import { sequelize } from '../config/database';

export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await Class.findAll({
      include: [{ model: User, as: 'trainer', attributes: ['id', 'fullName'] }]
    });
    res.json({ success: true, data: classes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookClass = async (req: AuthRequest, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user!.id;
    const { classId } = req.body;

    const gymClass = await Class.findByPk(classId);
    if (!gymClass) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'کلاس یافت نشد' });
    }

    // Check capacity
    const bookingsCount = await Booking.count({ where: { classId } });
    if (bookingsCount >= gymClass.capacity) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'ظرفیت تکمیل است' });
    }

    // Check duplicate booking
    const existingBooking = await Booking.findOne({ where: { userId, classId } });
    if (existingBooking) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'قبلا رزرو کرده‌اید' });
    }

    // Process Payment
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet || wallet.balance < gymClass.price) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'موجودی ناکافی است' });
    }

    // Deduct balance
    wallet.balance -= gymClass.price;
    await wallet.save({ transaction: t });

    // Create Booking
    const booking = await Booking.create({
      userId,
      classId,
      status: 'confirmed'
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'رزرو با موفقیت انجام شد',
      data: booking
    });

  } catch (error: any) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};
