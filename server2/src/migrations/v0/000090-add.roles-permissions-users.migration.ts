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

function getData() {
  // TODO: update policies & gql actions & permission const names (keys)...
  const permissions: IMigrationPermission[] = [
    // users
    { id: 10, name: 'super-admin', created_at: now, updated_at: now, deleted_at: null, },
    { id: 100, name: 'show-users', created_at: now, updated_at: now, deleted_at: null, },
    { id: 101, name: 'show-user-identities', created_at: now, updated_at: now, deleted_at: null, },
    { id: 110, name: 'create-users', created_at: now, updated_at: now, deleted_at: null, },
    { id: 111, name: 'register-users', created_at: now, updated_at: now, deleted_at: null, },
    { id: 120, name: 'update-users', created_at: now, updated_at: now, deleted_at: null, },
    { id: 121, name: 'update-user-self', created_at: now, updated_at: now, deleted_at: null, },
    { id: 122, name: 'update-user-passwords', created_at: now, updated_at: now, deleted_at: null, },
    { id: 130, name: 'soft-delete-users', created_at: now, updated_at: now, deleted_at: null, },
    { id: 131, name: 'soft-delete-user-self', created_at: now, updated_at: now, deleted_at: null, },
    { id: 132, name: 'hard-delete-users', created_at: now, updated_at: now, deleted_at: null, },
    { id: 133, name: 'restore-users', created_at: now, updated_at: now, deleted_at: null, },
    { id: 140, name: 'manage-users', created_at: now, updated_at: now, deleted_at: null, },
    { id: 141, name: 'deactivate-users', created_at: now, updated_at: now, deleted_at: null, },

    // roles
    { id: 200, name: 'show-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 210, name: 'create-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 220, name: 'update-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 230, name: 'soft-delete-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 231, name: 'hard-delete-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 232, name: 'restore-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 240, name: 'manage-roles', created_at: now, updated_at: now, deleted_at: null, },

    // permissions
    { id: 300, name: 'show-permissions', created_at: now, updated_at: now, deleted_at: null, },

    // user-roles
    { id: 400, name: 'show-user-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 410, name: 'create-user-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 420, name: 'update-user-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 430, name: 'hard-delete-user-roles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 440, name: 'manage-user-roles', created_at: now, updated_at: now, deleted_at: null, },

    // role-permissions
    { id: 500, name: 'show-role-permissions', created_at: now, updated_at: now, deleted_at: null, },
    { id: 510, name: 'create-role-permissions', created_at: now, updated_at: now, deleted_at: null, },
    { id: 520, name: 'update-role-permissions', created_at: now, updated_at: now, deleted_at: null, },
    { id: 530, name: 'delete-role-permissions', created_at: now, updated_at: now, deleted_at: null, },
    { id: 540, name: 'manage-role-permissions', created_at: now, updated_at: now, deleted_at: null, },

    // news-articles
    { id: 600, name: 'show-news-articles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 610, name: 'create-news-articles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 620, name: 'update-news-articles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 621, name: 'update-own-news-articles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 630, name: 'soft-delete-news-articles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 631, name: 'hard-delete-news-articles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 632, name: 'restore-news-articles', created_at: now, updated_at: now, deleted_at: null, },
    { id: 640, name: 'manage-news-articles', created_at: now, updated_at: now, deleted_at: null, },

    // news-article-statuses
    { id: 700, name: 'show-news-article-statuses', created_at: now, updated_at: now, deleted_at: null, },

    // npms-packages
    { id: 800, name: 'show-npms-packages', created_at: now, updated_at: now, deleted_at: null, },
    { id: 810, name: 'create-npms-packages', created_at: now, updated_at: now, deleted_at: null, },
    { id: 820, name: 'update-npms-packages', created_at: now, updated_at: now, deleted_at: null, },
    { id: 830, name: 'soft-delete-npms-packages', created_at: now, updated_at: now, deleted_at: null, },
    { id: 831, name: 'hard-delete-npms-packages', created_at: now, updated_at: now, deleted_at: null, },
    { id: 832, name: 'restore-npms-packages', created_at: now, updated_at: now, deleted_at: null, },
    { id: 840, name: 'manage-npms-packages', created_at: now, updated_at: now, deleted_at: null, },

    // npms dashboards
    { id: 900, name: 'show-npms-dashboards', created_at: now, updated_at: now, deleted_at: null, },
    { id: 910, name: 'create-npms-dashboards', created_at: now, updated_at: now, deleted_at: null, },
    { id: 920, name: 'update-npms-dashboards', created_at: now, updated_at: now, deleted_at: null, },
    { id: 921, name: 'update-own-npms-dashboards', created_at: now, updated_at: now, deleted_at: null, },
    { id: 930, name: 'soft-delete-npms-dashboards', created_at: now, updated_at: now, deleted_at: null, },
    { id: 931, name: 'hard-delete-npms-dashboards', created_at: now, updated_at: now, deleted_at: null, },
    { id: 932, name: 'restore-npms-dashboards', created_at: now, updated_at: now, deleted_at: null, },
    { id: 940, name: 'manage-npms-dashboards', created_at: now, updated_at: now, deleted_at: null, },

    // npms dashboards items
    { id: 1000, name: 'show-npms-dashboard-items', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1010, name: 'create-npms-dashboard-items', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1020, name: 'update-npms-dashboard-items', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1021, name: 'update-own-npms-dashboard-items', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1030, name: 'hard-delete-npms-dashboard-items', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1031, name: 'hard-delete-own-npms-dashboard-items', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1040, name: 'manage-npms-dashboard-items', created_at: now, updated_at: now, deleted_at: null, },

    // npms-dashboard-statuses
    { id: 1100, name: 'show-npms-dashboard-statuses', created_at: now, updated_at: now, deleted_at: null, },

    // integrations
    { id: 1200, name: 'show-integrations', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1201, name: 'show-integrations-secrets', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1220, name: 'manage-integrations', created_at: now, updated_at: now, deleted_at: null, },
  ];

  const roles: IMigrationRole[] = [{
    id: 1,
    name: 'admin',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  },
  {
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
  },
  {
    id: 2,
    name: 'System',
    created_at: now,
    updated_at: now,
    deleted_at: null,
  },
  {
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
  },
  {
    // system user => admin role
    user_id: 2,
    role_id: 1,
    created_at: now,
    updated_at: now,
  }];

  return {
    permissions,
    rolePermissions,
    roles,
    users,
    userRoles,
  };
}


// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const { permissions, rolePermissions, roles, userRoles, users } = getData();
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

    const maxRole = roles.reduce((p, c) => c.id > p ? c.id : p, 0);
    const maxUser = users.reduce((p, c) => c.id > p ? c.id : p, 0);
    await sequelize.query(`SELECT setval('roles_id_seq', ${maxRole})`, { transaction });
    await sequelize.query(`SELECT setval('users_id_seq', ${maxUser})`, { transaction });

  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction, } = arg;
    const { permissions, rolePermissions, roles, userRoles, users } = getData();
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