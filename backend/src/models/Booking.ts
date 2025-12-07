
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Class } from './Class';

export class Booking extends Model {
  public id!: string;
  public userId!: string;
  public classId!: number;
  public status!: 'confirmed' | 'cancelled';
}

Booking.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Class, key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    defaultValue: 'confirmed'
  }
}, {
  sequelize,
  modelName: 'Booking',
  tableName: 'bookings'
});
