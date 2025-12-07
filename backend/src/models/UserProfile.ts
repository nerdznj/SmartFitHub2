
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export class UserProfile extends Model<InferAttributes<UserProfile>, InferCreationAttributes<UserProfile>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare weight: number | null;
  declare height: number | null;
  declare age: number | null;
  declare gender: 'male' | 'female' | null;
  declare bodyType: 'ectomorph' | 'mesomorph' | 'endomorph' | null;
  declare fitnessGoal: string | null;
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