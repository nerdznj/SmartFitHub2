
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export class SocialPost extends Model<InferAttributes<SocialPost>, InferCreationAttributes<SocialPost>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare content: string;
  declare imageUrl: string | null;
  declare likes: CreationOptional<number>;
}

SocialPost.init({
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'SocialPost',
  tableName: 'social_posts'
});