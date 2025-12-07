
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export class TrainingPlan extends Model {
  public id!: string;
  public userId!: string;
  public goal!: string;
  public content!: string; // JSON string of the plan
  public status!: 'active' | 'completed' | 'archived';
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
    type: DataTypes.TEXT, // Storing large JSON response from AI
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
