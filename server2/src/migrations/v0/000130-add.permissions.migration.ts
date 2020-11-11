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
    name: 'ShowNpmsRecord',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 810,
    name: 'CreateNpmsRecord',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 820,
    name: 'UpdateNpmsRecord',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 830,
    name: 'DeleteNpmsRecord',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 840,
    name: 'ManageNpmsRecords',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 900,
    name: 'ShowNpmsDashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 910,
    name: 'CreateNpmsDashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 920,
    name: 'UpdateNpmsDashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 930,
    name: 'DeleteNpmsDashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 940,
    name: 'ManageNpmsDashboard',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1000,
    name: 'ShowNpmsDashboardItem',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1010,
    name: 'CreateNpmsDashboardItem',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1020,
    name: 'UpdateNpmsDashboardItem',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1030,
    name: 'DeleteNpmsDashboardItem',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }, {
    id: 1040,
    name: 'ManageNpmsDashboardItem',
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