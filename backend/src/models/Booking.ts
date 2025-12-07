
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Class } from './Class';

export class Booking extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare classId: number;
  declare status: CreationOptional<'confirmed' | 'cancelled'>;
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