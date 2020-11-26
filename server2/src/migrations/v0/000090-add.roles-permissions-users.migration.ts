import { QueryInterface, Sequelize, DataTypes, Transaction, Op } from "sequelize";
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
    { id: 700, name: 'role-permissions', colour: '#FAE7C2', created_at: now, updated_at: now, deleted_at: null, },
    { id: 800, name: 'users', colour: '#7D76AD', created_at: now, updated_at: now, deleted_at: null, },
    { id: 900, name: 'user-roles', colour: '#C0B6FA', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1000, name: 'user-token-types', colour: '#99ACAD', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1100, name: 'user-tokens', colour: '#CFFADC', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1200, name: 'news-article-statuses', colour: '#D1FAA7', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1300, name: 'news-articles', colour: '#FAE8C3', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1400, name: 'npms-packages', colour: '#FAABAA', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1500, name: 'npms-dashboard-statuses', colour: '#F2B6FA', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1600, name: 'npms-dashboards', colour: '#BBFDF3', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1700, name: 'npms-dashboard-items', colour: '#A8E3C9', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1800, name: 'integrations', colour: '#C6FAD5', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1900, name: 'blog-categories', colour: '#A8E3A8', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2000, name: 'blog-posts', colour: '#D2FDBB', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2100, name: 'blog-post-images', colour: '#C5FAF3', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2200, name: 'blog-post-comments', colour: '#E6FAD2', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2300, name: 'blog-post-votes', colour: '#B8C1FA', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2400, name: 'blog-post-comment-votes', colour: '#FABBA0', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2500, name: 'blog-post-tags', colour: '#ED91FA', created_at: now, updated_at: now, deleted_at: null, },
  ];

  // TODO: update policies & gql actions & permission const names (keys)...
  const permissions: IMigrationPermission[] = [
    // super admin
    { id: 100, category_id: 100, name: 'super-admin', created_at: now, updated_at: now, deleted_at: null, },

    // jobs
    { id: 200, category_id: 200, name: 'show', created_at: now, updated_at: now, deleted_at: null, },

    // logs
    { id: 300, category_id: 300, name: 'show', created_at: now, updated_at: now, deleted_at: null, },

    // permission-categories:
    { id: 400, category_id: 400, name: 'show', created_at: now, updated_at: now, deleted_at: null, },

    // Permissions
    { id: 500, category_id: 500, name: 'show', created_at: now, updated_at: now, deleted_at: null, },

    // Roles
    { id: 600, category_id: 600, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 610, category_id: 600, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 620, category_id: 600, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 630, category_id: 600, name: 'soft-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 631, category_id: 600, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 632, category_id: 600, name: 'restore', created_at: now, updated_at: now, deleted_at: null, },
    { id: 640, category_id: 600, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // RolePermissions
    { id: 700, category_id: 700, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 710, category_id: 700, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 720, category_id: 700, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 730, category_id: 700, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 740, category_id: 700, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // Users
    { id: 800, category_id: 800, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 801, category_id: 800, name: 'show-dentities', created_at: now, updated_at: now, deleted_at: null, },
    { id: 810, category_id: 800, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 811, category_id: 800, name: 'register', created_at: now, updated_at: now, deleted_at: null, },
    { id: 820, category_id: 800, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 821, category_id: 800, name: 'update-self', created_at: now, updated_at: now, deleted_at: null, },
    { id: 822, category_id: 800, name: 'update-passwords', created_at: now, updated_at: now, deleted_at: null, },
    { id: 830, category_id: 800, name: 'soft-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 831, category_id: 800, name: 'soft-delete-self', created_at: now, updated_at: now, deleted_at: null, },
    { id: 832, category_id: 800, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 833, category_id: 800, name: 'restore', created_at: now, updated_at: now, deleted_at: null, },
    { id: 840, category_id: 800, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },
    { id: 841, category_id: 800, name: 'deactivate', created_at: now, updated_at: now, deleted_at: null, },

    // UserRoles
    { id: 900, category_id: 900, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 910, category_id: 900, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 920, category_id: 900, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 930, category_id: 900, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 940, category_id: 900, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // UserTokenTypes
    { id: 1000, category_id: 1000, name: 'Show', created_at: now, updated_at: now, deleted_at: null, },

    // UserTokens
    { id: 1100, category_id: 1100, name: 'Show', created_at: now, updated_at: now, deleted_at: null, },

    // NewsArticleStatuses
    { id: 1200, category_id: 1200, name: 'Show', created_at: now, updated_at: now, deleted_at: null, },

    // NewsArticles
    { id: 1300, category_id: 1300, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1310, category_id: 1300, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1320, category_id: 1300, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1321, category_id: 1300, name: 'update-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1330, category_id: 1300, name: 'soft-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1331, category_id: 1300, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1332, category_id: 1300, name: 'restore', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1340, category_id: 1300, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // NpmsPackages
    { id: 1400, category_id: 1400, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1410, category_id: 1400, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1420, category_id: 1400, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1430, category_id: 1400, name: 'soft-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1431, category_id: 1400, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1432, category_id: 1400, name: 'restore', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1440, category_id: 1400, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // NpmsDashboardStatuses
    { id: 1500, category_id: 1500, name: 'show', created_at: now, updated_at: now, deleted_at: null, },

    // NpmsDashboards
    { id: 1600, category_id: 1600, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1610, category_id: 1600, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1620, category_id: 1600, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1621, category_id: 1600, name: 'update-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1630, category_id: 1600, name: 'soft-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1631, category_id: 1600, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1632, category_id: 1600, name: 'restore', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1640, category_id: 1600, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // NpmsDashboardItems
    { id: 1700, category_id: 1700, name: 'Show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1710, category_id: 1700, name: 'Create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1720, category_id: 1700, name: 'Update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1721, category_id: 1700, name: 'Update-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1730, category_id: 1700, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1731, category_id: 1700, name: 'hard-delete-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1740, category_id: 1700, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // Integrations
    { id: 1800, category_id: 1800, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1801, category_id: 1800, name: 'show-secrets', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1820, category_id: 1800, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // BlogCategories
    { id: 1900, category_id: 1900, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1920, category_id: 1900, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1930, category_id: 1900, name: 'soft-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1931, category_id: 1900, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1932, category_id: 1900, name: 'restore', created_at: now, updated_at: now, deleted_at: null, },
    { id: 1940, category_id: 1900, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // BlogPosts
    { id: 2000, category_id: 2000, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2001, category_id: 2000, name: 'show-all-vote-count', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2002, category_id: 2000, name: 'show-own-vote-count', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2010, category_id: 2000, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2020, category_id: 2000, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2021, category_id: 2000, name: 'update-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2022, category_id: 2000, name: 'attach-tags', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2030, category_id: 2000, name: 'soft-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2031, category_id: 2000, name: 'soft-delete-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2032, category_id: 2000, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2033, category_id: 2000, name: 'hard-delete-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2034, category_id: 2000, name: 'restore', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2040, category_id: 2000, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // BlogPostImages
    { id: 2100, category_id: 2100, name: 'show-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2101, category_id: 2100, name: 'show-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2110, category_id: 2100, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2120, category_id: 2100, name: 'update-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2121, category_id: 2100, name: 'update-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2130, category_id: 2100, name: 'soft-delete-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2131, category_id: 2100, name: 'soft-delete-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2132, category_id: 2100, name: 'hard-delete-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2133, category_id: 2100, name: 'hard-delete-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2134, category_id: 2100, name: 'restore-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2135, category_id: 2100, name: 'restore-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2140, category_id: 2100, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // BlogPostComments
    { id: 2200, category_id: 2200, name: 'show-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2201, category_id: 2200, name: 'show-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2202, category_id: 2200, name: 'show-all-on-own-posts', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2210, category_id: 2200, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2220, category_id: 2200, name: 'update-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2221, category_id: 2200, name: 'update-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2230, category_id: 2200, name: 'soft-delete-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2231, category_id: 2200, name: 'soft-delete-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2232, category_id: 2200, name: 'hard-delete-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2233, category_id: 2200, name: 'hard-delete-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2234, category_id: 2200, name: 'restore-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2235, category_id: 2200, name: 'restore-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2240, category_id: 2200, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // BlogPostVotes
    { id: 2300, category_id: 2300, name: 'show-on-all-blog-posts', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2301, category_id: 2300, name: 'show-on-own-blog-posts', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2302, category_id: 2300, name: 'show-own-on-all-blog-posts', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2310, category_id: 2300, name: 'create-and-update-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2311, category_id: 2300, name: 'update-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2331, category_id: 2300, name: 'hard-delete-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2332, category_id: 2300, name: 'hard-delete-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2340, category_id: 2300, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // BlogPostCommentVotes
    { id: 2400, category_id: 2400, name: 'show-on-all-blog-posts', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2401, category_id: 2400, name: 'show-on-own-blog-posts', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2402, category_id: 2400, name: 'show-own-on-all-blog-posts', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2410, category_id: 2400, name: 'create-and-update-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2411, category_id: 2400, name: 'update-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2431, category_id: 2400, name: 'hard-delete-all', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2432, category_id: 2400, name: 'hard-delete-own', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2440, category_id: 2400, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },

    // BlogPostTags
    { id: 2500, category_id: 2500, name: 'show', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2510, category_id: 2500, name: 'create', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2520, category_id: 2500, name: 'update', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2530, category_id: 2500, name: 'soft-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2535, category_id: 2500, name: 'hard-delete', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2531, category_id: 2500, name: 'restore', created_at: now, updated_at: now, deleted_at: null, },
    { id: 2540, category_id: 2500, name: 'manage', created_at: now, updated_at: now, deleted_at: null, },
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

  up = async (arg: IMigrationUpArg) => {
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