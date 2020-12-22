import { Op } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

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

interface IMigrationRolePermission {
  role_id: number,
  permission_id: number,
  created_at: Date,
  updated_at: Date,
}

const now = new Date();

function getData() {
  const categories: IMigrationPermissionCategory[] = [
    { id: 1800, name: 'blog-posts-statuses', colour: '#F2924E', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1900, name: 'blog-posts', colour: '#FC7F51', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2000, name: 'blog-post-comments', colour: '#E66655', created_at: now, updated_at: now, deleted_at: null, },
  ];

  // TODO: update policies & gql actions & permission const names (keys)...
  const permissions: IMigrationPermission[] = [
    // blog-post-statuses
    { category_id: 1800, id: 1800, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },

    // blog-posts
    { category_id: 1900, id: 1900, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1900, id: 1910, name: 'writer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1900, id: 1920, name: 'manager', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 1900, id: 1930, name: 'admin', created_at: now, updated_at: now, deleted_at: null, },

    // blog-post-comments
    { category_id: 2000, id: 2000, name: 'viewer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 2000, id: 2010, name: 'writer', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 2000, id: 2020, name: 'manager', created_at: now, updated_at: now, deleted_at: null, },
    { category_id: 2000, id: 2030, name: 'admin', created_at: now, updated_at: now, deleted_at: null, },
  ];

  // give the admin role all permissions
  const rolePermissions: IMigrationRolePermission[] = permissions.map((permission): IMigrationRolePermission => ({
    // admin role => every permission
    role_id: 1,
    permission_id: permission.id,
    created_at: now,
    updated_at: now,
  }));


  return {
    categories,
    permissions,
    rolePermissions,
  };
}


// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    const { categories, permissions, rolePermissions, } = getData();
    await queryInterface.bulkInsert('permission_categories', categories, { transaction });
    await queryInterface.bulkInsert('permissions', permissions, { transaction });
    await queryInterface.bulkInsert('role_permissions', rolePermissions, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction, } = arg;
    const { permissions, rolePermissions, categories, } = getData();

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

    await queryInterface.bulkDelete(
      'permission_categories',
      { [Op.or]: categories.map(category => ({ [Op.and]: [ { id: category.id }, ], })), },
      { transaction },
    );
  };
}
