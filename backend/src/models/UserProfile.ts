
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export class UserProfile extends Model {
  public id!: string;
  public userId!: string;
  public weight!: number;
  public height!: number;
  public age!: number;
  public gender!: 'male' | 'female';
  public bodyType!: 'ectomorph' | 'mesomorph' | 'endomorph';
  public fitnessGoal!: string;
}

UserProfile.init({
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
  weight: DataTypes.FLOAT,
  height: DataTypes.FLOAT,
  age: DataTypes.INTEGER,
  gender: DataTypes.ENUM('male', 'female'),
  bodyType: DataTypes.ENUM('ectomorph', 'mesomorph', 'endomorph'),
  fitnessGoal: DataTypes.STRING
}, {
  sequelize,
  modelName: 'UserProfile',
  tableName: 'user_profiles'
});
