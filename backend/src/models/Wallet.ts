
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export class Wallet extends Model {
  public id!: string;
  public userId!: string;
  public balance!: number;
  public currency!: string;
}

Wallet.init({
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
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'IRR'
  }
}, {
  sequelize,
  modelName: 'Wallet',
  tableName: 'wallets'
});
