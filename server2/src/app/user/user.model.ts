import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../db/sequelize';


export class UserModel extends Model {
  id!: unknown;
  first!: string;
  last?: string;
}

UserModel.init({
  first: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
});
