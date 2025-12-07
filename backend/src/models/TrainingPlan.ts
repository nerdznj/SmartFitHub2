
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export class TrainingPlan extends Model<InferAttributes<TrainingPlan>, InferCreationAttributes<TrainingPlan>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare goal: string;
  declare content: string;
  declare status: CreationOptional<'active' | 'completed' | 'archived'>;
}

TrainingPlan.init({
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
  goal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'archived'),
    defaultValue: 'active'
  }
}, {
  sequelize,
  modelName: 'TrainingPlan',
  tableName: 'training_plans'
});