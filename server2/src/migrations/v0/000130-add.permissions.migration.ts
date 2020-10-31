import { QueryInterface, Sequelize, DataTypes, Transaction, Op } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";
import bcryptjs from 'bcryptjs';

interface IMigrationPermission {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}

interface IMigrationRolePermission {
  role_id: number,
  permission_id: number,
  created_at: Date,
  updated_at: Date,
}

const now = new Date();

const permissions: IMigrationPermission[] = [{
    id: 800,
    name: 'show-npms-record',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 810,
    name: 'create-npms-record',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 820,
    name: 'update-npms-record',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 830,
    name: 'delete-npms-record',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 840,
    name: 'manage-npms-records',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 900,
    name: 'show-npms-dashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 910,
    name: 'create-npms-dashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 920,
    name: 'update-npms-dashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 930,
    name: 'delete-npms-dashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 940,
    name: 'manage-npms-dashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1000,
    name: 'show-npms-dashboard-item',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1010,
    name: 'create-npms-dashboard-item',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1020,
    name: 'update-npms-dashboard-item',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1030,
    name: 'delete-npms-dashboard-item',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1040,
    name: 'manage-npms-dashboard-item',
    created_at: now,
    updated_at: now,
    deleted_at: null,
}];


// give the admin role all permissions
const rolePermissions: IMigrationRolePermission[] = permissions.map((permission): IMigrationRolePermission => ({
  // admin role => every permission
  role_id: 1,
  permission_id: permission.id,
  created_at: now,
  updated_at: now,
}));

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    await queryInterface.bulkInsert('permissions', permissions, { transaction });
    await queryInterface.bulkInsert('role_permissions', rolePermissions, { transaction });

    const maxPerm = permissions.reduce((p, c) => c.id > p ? c.id : p, 0);
    await sequelize.query(`SELECT setval('permissions_id_seq', ${maxPerm})`, { transaction });
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction, } = arg;

    await queryInterface.bulkDelete(
      'role_permissions',
      {
        [Op.or]: rolePermissions.map(rp => ({
          [Op.and]: [
            { role_id: rp.role_id },
            { permission_id: rp.permission_id },
          ],
        })),
      },
      { transaction },
    );

    await queryInterface.bulkDelete(
      'permissions',
      {
        [Op.or]: permissions.map(permission => ({
          [Op.and]: [
            { id: permission.id },
          ],
        })),
      },
      { transaction },
    );
  };
};