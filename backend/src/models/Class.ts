
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export class Class extends Model<InferAttributes<Class>, InferCreationAttributes<Class>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare trainerId: string;
  declare capacity: number;
  declare date: string;
  declare startTime: string;
  declare price: CreationOptional<number>;
  declare type: string | null;
}

Class.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  trainerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.TIME, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  type: { type: DataTypes.STRING } // e.g. Yoga, Crossfit
}, {
  sequelize,
  modelName: 'Class',
  tableName: 'classes'
});