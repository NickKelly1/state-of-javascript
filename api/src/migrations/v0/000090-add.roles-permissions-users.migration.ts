import { Op } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";
import bcryptjs from 'bcryptjs';

interface IMigrationPermissionCategory {
  id: number;
  name: string;
  colour: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
}

interface IMigrationPermission {
  id: number;
  name: string;
  category_id: number;
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
  const categories: IMigrationPermissionCategory[] = [
    { id: 100, name: 'super-admin', colour: '#B08787', created_at: now, updated_at: now, deleted_at: null, },
    { id: 200, name: 'jobs', colour: '#FCFCC2', created_at: now, updated_at: now, deleted_at: null, },
    { id: 300, name: 'logs', colour: '#FCDBDB', created_at: now, updated_at: now, deleted_at: null, },
    { id: 400, name: 'permissions-categories', colour: '#C2E6FC', created_at: now, updated_at: now, deleted_at: null, },
    { id: 500, name: 'permissions', colour: '#90A4B0', created_at: now, updated_at: now, deleted_at: null, },
    { id: 600, name: 'roles', colour: '#CFF7FA', created_at: now, updated_at: now, deleted_at: null, },
    { id: 800, name: 'users', colour: '#7D76AD', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1000, name: 'user-token-types', colour: '#99ACAD', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1100, name: 'user-tokens', colour: '#CFFADC', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1200, name: 'news-article-statuses', colour: '#D1FAA7', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1300, name: 'news-articles', colour: '#FAE8C3', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1400, name: 'npms-packages', colour: '#FAABAA', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1500, name: 'npms-dashboard-statuses', colour: '#F2B6FA', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1600, name: 'npms-dashboards', colour: '#BBFDF3', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1700, name: 'integrations', colour: '#C6FAD5', created_at: now, updated_at: now, deleted_at: null, },
  ];

  // TODO: update policies & gql actions & permission const names (keys)...
  const permissions: IMigrationPermission[] = [
    // super-admin
    { category_id: 100, id: 100, name: 'super-admin', created_at: now, updated_at: now, deleted_at: null, },

    // jobs
    { category_id: 200, id: 200, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },

    // logs
    { category_id: 300, id: 300, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },

    // permission-categories
    { category_id: 400, id: 400, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },

    // permissions
    { category_id: 500, id: 500, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },

    // roles
    { category_id: 600, id: 600, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 600, id: 610, name: 'manager', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 600, id: 620, name: 'admin', created_at: now, updated_at: now, deleted_at: null, },

    // users
    { category_id: 800, id: 800, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 800, id: 805, name: 'view-identities', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 800, id: 810, name: 'manager', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 800, id: 820, name: 'register', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 800, id: 830, name: 'update-self', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 800, id: 840, name: 'update-passwords', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 800, id: 850, name: 'deactivate', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 800, id: 860, name: 'force-update-emails', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 800, id: 870, name: 'force-verify', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 800, id: 880, name: 'admin', created_at: now, updated_at: now, deleted_at: null, },

    // user-token-types
    { category_id: 1000, id: 1000, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },

    // user-tokens
    { category_id: 1100, id: 1100, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },

    // news-article-statuses
    { category_id: 1200, id: 1200, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },

    // news-articles
    { category_id: 1300, id: 1300, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1300, id: 1310, name: 'writer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1300, id: 1320, name: 'manager', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1300, id: 1330, name: 'admin', created_at: now, updated_at: now, deleted_at: null, },

    // npms-packages
    { category_id: 1400, id: 1400, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1400, id: 1410, name: 'creator', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1400, id: 1420, name: 'admin', created_at: now, updated_at: now, deleted_at: null, },

    // npms-dashboard-statuses
    { category_id: 1500, id: 1500, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },

    // npms-dashboards
    { category_id: 1600, id: 1600, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1600, id: 1610, name: 'creator', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1600, id: 1630, name: 'manager', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1600, id: 1640, name: 'admin', created_at: now, updated_at: now, deleted_at: null, },

    // integrations
    { category_id: 1700, id: 1700, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1700, id: 1701, name: 'view-secrets', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1700, id: 1720, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },
  ];

  const roles: IMigrationRole[] = [
    {
      id: 1,
      name: 'admin',
      created_at: now,
      updated_at: now,
      deleted_at: null,
    },
    {
      id: 2,
      name: 'authenticated',
      created_at: now,
      updated_at: now,
      deleted_at: null,
    },
    {
      id: 3,
      name: 'public',
      created_at: now,
      updated_at: now,
      deleted_at: null,
    },
  ];


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
    categories,
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

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { env, queryInterface, sequelize, transaction } = arg;
    const { categories, permissions, rolePermissions, roles, userRoles, users } = getData();
    await queryInterface.bulkInsert('permission_categories', categories, { transaction });
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

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction, } = arg;
    const { permissions, rolePermissions, roles, userRoles, users, categories } = getData();
    await queryInterface.bulkDelete(
      'user_passwords',
      { user_id: 1, },
      { transaction },
    );

    await queryInterface.bulkDelete(
      'user_roles',
      { [Op.or]: userRoles.map(ur => ({ [Op.and]: [
        { user_id: ur.user_id },
        { role_id: ur.role_id },
      ], })), },
      { transaction },
    );

    await queryInterface.bulkDelete(
      'users',
      { [Op.or]: users.map(user => ({ [Op.and]: [ { id: user.id }, ], })), },
      { transaction },
    );

    await queryInterface.bulkDelete(
      'role_permissions',
      { [Op.or]: rolePermissions.map(rp => ({ [Op.and]: [
        { role_id: rp.role_id },
        { permission_id: rp.permission_id },
      ], })), },
      { transaction },
    );

    await queryInterface.bulkDelete(
      'roles',
      { [Op.or]: roles.map(role => ({ [Op.and]: [ { id: role.id }, ], })), },
      { transaction },
    );

    await queryInterface.bulkDelete(
      'permissions',
      { [Op.or]: permissions.map(permission => ({ [Op.and]: [ { id: permission.id }, ], })), },
      { transaction },
    );

    await queryInterface.bulkDelete(
      'permission_categories',
      { [Op.or]: categories.map(category => ({ [Op.and]: [ { id: category.id }, ], })), },
      { transaction },
    );
  };
}
