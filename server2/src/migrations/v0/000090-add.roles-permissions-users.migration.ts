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

interface IMigrationRole {
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

interface IMigrationUser {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}

interface IMigrationUserRole {
  user_id: number,
  role_id: number,
  created_at: Date,
  updated_at: Date,
}

const now = new Date();

const permissions: IMigrationPermission[] = [{
  id: 10,
  name: 'super-admin',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 100,
  name: 'show-user',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 110,
  name: 'create-user',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 120,
  name: 'update-user',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 130,
  name: 'delete-user',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 140,
  name: 'manage-user',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 200,
  name: 'show-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 210,
  name: 'create-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 220,
  name: 'update-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 230,
  name: 'delete-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 240,
  name: 'manage-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 300,
  name: 'show-permission',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 400,
  name: 'show-user-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 410,
  name: 'create-user-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 420,
  name: 'update-user-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 430,
  name: 'delete-user-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 440,
  name: 'manage-user-role',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 500,
  name: 'show-role-permission',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 510,
  name: 'create-role-permission',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 520,
  name: 'update-role-permission',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 530,
  name: 'delete-role-permission',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 540,
  name: 'manage-role-permission',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 600,
  name: 'show-news-article',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 610,
  name: 'create-news-article',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 620,
  name: 'update-news-article',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 630,
  name: 'delete-news-article',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 640,
  name: 'manage-news-article',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 700,
  name: 'show-news-article-status',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}];

const roles: IMigrationRole[] = [{
  id: 1,
  name: 'admin',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 2,
  name: 'public',
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


const users: IMigrationUser[] = [{
  id: 1,
  name: 'Admin',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 2,
  name: 'System',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}, {
  id: 3,
  name: 'Anonymous',
  created_at: now,
  updated_at: now,
  deleted_at: null,
}];


const userRoles: IMigrationUserRole[] = [{
  // admin user => admin role
  user_id: 1,
  role_id: 1,
  created_at: now,
  updated_at: now,
}, {
  // system user => admin role
  user_id: 2,
  role_id: 1,
  created_at: now,
  updated_at: now,
}];


// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    await queryInterface.bulkInsert('permissions', permissions, { transaction });
    await queryInterface.bulkInsert('roles', roles, { transaction });
    await queryInterface.bulkInsert('role_permissions', rolePermissions, { transaction });
    await queryInterface.bulkInsert('users', users, { transaction });
    await queryInterface.bulkInsert('user_roles', userRoles, { transaction });

    // admin password
    const adminPswSalt = await bcryptjs.hash(Math.random.toString(), env.PSW_SALT_ROUNDS);
    const adminPsw = await bcryptjs.hash(`${adminPswSalt}${env.ADMIN_INITIAL_PSW}`, env.PSW_SALT_ROUNDS);
    await queryInterface.bulkInsert('user_passwords', [{
      user_id: 1,
      hash: adminPsw,
      salt: adminPswSalt,
      created_at: now,
      updated_at: now,
    }], { transaction });

    const maxPerm = permissions.reduce((p, c) => c.id > p ? c.id : p, 0);
    const maxRole = roles.reduce((p, c) => c.id > p ? c.id : p, 0);
    const maxUser = users.reduce((p, c) => c.id > p ? c.id : p, 0);
    await sequelize.query(`SELECT setval('permissions_id_seq', ${maxPerm})`, { transaction });
    await sequelize.query(`SELECT setval('roles_id_seq', ${maxRole})`, { transaction });
    await sequelize.query(`SELECT setval('users_id_seq', ${maxUser})`, { transaction });

  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction, } = arg;

    await queryInterface.bulkDelete(
      'user_passwords',
      { user_id: 1, },
      { transaction },
    );

    await queryInterface.bulkDelete(
      'user_roles',
      {
        [Op.or]: userRoles.map(ur => ({
          [Op.and]: [
            { user_id: ur.user_id },
            { role_id: ur.role_id },
          ],
        })),
      },
      { transaction },
    );

    await queryInterface.bulkDelete(
      'users',
      {
        [Op.or]: users.map(user => ({
          [Op.and]: [
            { id: user.id },
          ],
        })),
      },
      { transaction },
    );

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
      'roles',
      {
        [Op.or]: roles.map(role => ({
          [Op.and]: [
            { id: role.id },
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