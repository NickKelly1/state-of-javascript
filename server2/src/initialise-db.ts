import { Association, ColumnDescription, ColumnsDescription, DataTypes, Model, Optional, QueryInterface, Sequelize, Transaction } from 'sequelize';
import { NewsArticleStatusAssociation } from './app/news-article-status/news-article-status.associations';
import { NewsArticleStatusField } from './app/news-article-status/news-article-status.attributes';
import { initNewsArticleStatusModel, NewsArticleStatusModel } from './app/news-article-status/news-article-status.model';
import { NewsArticleAssociation } from './app/news-article/news-article.associations';
import { NewsArticleField } from './app/news-article/news-article.attributes';
import { PermissionAssociation } from './app/permission/permission.associations';
import { PermissionField } from './app/permission/permission.attributes';
import { RolePermissionAssociation } from './app/role-permission/role-permission.associations';
import { RolePermissionField } from './app/role-permission/role-permission.attributes';
import { RoleAssociation } from './app/role/role.associations';
import { RoleField } from './app/role/role.attributes';
import { UserPasswordAssociation } from './app/user-password/user-password.associations';
import { UserPasswordField } from './app/user-password/user-password.attributes';
import { UserRoleAssociation } from './app/user-role/user-role.associations';
import { UserRoleField } from './app/user-role/user-role.attributes';
import { UserAssociation } from './app/user/user.associations';
import { UserField } from './app/user/user.attributes';
import {
  PermissionModel,
  RoleModel,
  UserModel,
  UserPasswordModel,
  RolePermissionModel,
  UserRoleModel,
  initPermissionModel,
  initRoleModel,
  initRolePermissionModel,
  initUserModel,
  initUserPasswordModel,
  initUserRoleModel,
  NewsArticleModel,
  initNewsArticleModel,
} from './circle';
import { logger } from './common/logger/logger';
import { EnvService } from './common/environment/env';
import { usersInitialise } from './app/user/users.initialise';
import { userRolesInitialise } from './app/user-role/user-roles.initialise';
import { rolePermissionsInitialise } from './app/role-permission/role-permissions.initialise';
import { rolesInitialise } from './app/role/roles.initialise';
import { permissionsInitialise } from './app/permission/permissions.initialise';
import { QueryRunner } from './app/db/query-runner';
import { prettyQ } from './common/helpers/pretty.helper';
import { migrateScriptUp } from './common/migration/migration.script.up';


/**
 * Overall database / model initialisation
 *
 * @param arg
 */
export async function initialiseDb(arg: {
  sequelize: Sequelize;
  env: EnvService;
}): Promise<void> {
  const {
    sequelize,
    env,
  } = arg;

  // -------------------------
  // --- check credentials ---
  // -------------------------

  // make sure db creds work...
  try {
    const auth = await sequelize.authenticate();
  } catch (error) {
    logger.debug('Failed to authenticate with database...');
    throw error;
  }

  await sequelize.transaction(async (transaction) => {
    try {
      const qInterface = sequelize.getQueryInterface();
      await qInterface.startTransaction(transaction);
      await initialiseWithTransaction({ sequelize, qInterface, transaction, env });
    } catch (error) {
      logger.error(`Failed to initialise database: ${prettyQ(error)}`);
      throw error;
    }
  });
}


/**
 * Initialise within a transaction
 *
 * @param arg
 */
async function initialiseWithTransaction(arg: {
  sequelize: Sequelize;
  qInterface: QueryInterface,
  transaction: Transaction;
  env: EnvService;
}): Promise<void> {
  const {
    sequelize,
    transaction,
    qInterface,
    env,
  } = arg;

  // ----------------------
  // --- run all migrations ---
  // ----------------------
  await migrateScriptUp();

  // --------------
  // --- models ---
  // --------------

  // boot models
  logger.info('registering models...');
  initUserPasswordModel({ sequelize });
  initUserModel({ sequelize });
  initRoleModel({ sequelize });
  initPermissionModel({ sequelize });
  initUserRoleModel({ sequelize });
  initRolePermissionModel({ sequelize });
  initNewsArticleModel({ sequelize });
  initNewsArticleStatusModel({ sequelize });



  // -----------------------
  // --- model relations ---
  // -----------------------
  logger.info('registering model relations...');

  // user
  UserModel.hasOne(UserPasswordModel, { as: UserAssociation.password, sourceKey: UserField.id, foreignKey: UserPasswordField.user_id, })
  UserModel.hasMany(UserRoleModel, { as: UserAssociation.userRoles, sourceKey: UserField.id, foreignKey: UserRoleField.user_id, })
  UserModel.belongsToMany(RoleModel, { as: UserAssociation.roles, through: UserRoleModel as typeof Model, sourceKey: UserField.id, targetKey: RoleField.id, foreignKey: UserRoleField.user_id, otherKey: UserRoleField.role_id });
  UserModel.hasMany(NewsArticleModel, { as: UserAssociation.newsArticles, sourceKey: UserField.id, foreignKey: NewsArticleField.author_id, })

  // user password
  UserPasswordModel.belongsTo(UserModel, { as: UserPasswordAssociation.user, foreignKey: UserPasswordField.user_id, targetKey: UserField.id, });

  // role
  RoleModel.hasMany(UserRoleModel, { as: RoleAssociation.userRoles, sourceKey: RoleField.id, foreignKey: UserRoleField.role_id, })
  RoleModel.hasMany(RolePermissionModel, { as: RoleAssociation.rolePermissions, sourceKey: RoleField.id, foreignKey: RolePermissionField.role_id, })
  RoleModel.belongsToMany(UserModel, { as: RoleAssociation.users, through: UserRoleModel as typeof Model, sourceKey: RoleField.id, targetKey: UserField.id, foreignKey: UserRoleField.role_id, otherKey: UserRoleField.user_id });
  RoleModel.belongsToMany(PermissionModel, { as : RoleAssociation.permissions, through: RolePermissionModel as typeof Model, sourceKey: RoleField.id, targetKey: PermissionField.id, foreignKey: RolePermissionField.role_id, otherKey: RolePermissionField.permission_id });

  // permission
  PermissionModel.hasMany(RolePermissionModel, { as: PermissionAssociation.rolePermissions, sourceKey: PermissionField.id, foreignKey: RolePermissionField.permission_id, })
  PermissionModel.belongsToMany(RoleModel, { as: PermissionAssociation.roles, through: RolePermissionModel as typeof Model, sourceKey: PermissionField.id, targetKey: RoleField.id, foreignKey: RolePermissionField.permission_id, otherKey: RolePermissionField.role_id });

  // role permission
  RolePermissionModel.belongsTo(RoleModel, { as: RolePermissionAssociation.role, targetKey: RoleField.id, foreignKey: RolePermissionField.role_id, })
  RolePermissionModel.belongsTo(PermissionModel, { as: RolePermissionAssociation.permission, targetKey: PermissionField.id, foreignKey: RolePermissionField.role_id, })

  // user role
  UserRoleModel.belongsTo(UserModel, { as: UserRoleAssociation.user, targetKey: UserField.id, foreignKey: UserRoleField.user_id, });
  UserRoleModel.belongsTo(RoleModel, { as: UserRoleAssociation.role, targetKey: RoleField.id, foreignKey: UserRoleField.role_id, })

  // news article
  NewsArticleModel.belongsTo(UserModel, { as: NewsArticleAssociation.author, targetKey: UserField.id, foreignKey: NewsArticleField.author_id, })
  NewsArticleModel.belongsTo(NewsArticleStatusModel, { as: NewsArticleAssociation.status, targetKey: NewsArticleStatusField.id, foreignKey: NewsArticleField.status_id, })

  // news article status
  NewsArticleStatusModel.hasMany(NewsArticleModel, { as: NewsArticleStatusAssociation.articles, sourceKey: NewsArticleStatusField.id, foreignKey: NewsArticleField.status_id, })

  // ---------------
  // --- domains ---
  // ---------------

  // initialise domain
  const runner = new QueryRunner(transaction);
  logger.info('Initialising Permissions...');
  await permissionsInitialise({ env, runner });

  logger.info('Initialising Roles...');
  await rolesInitialise({ env, runner });

  logger.info('Initialising RolePermissions...');
  await rolePermissionsInitialise({ env, runner });

  logger.info('Initialising Users...');
  await usersInitialise({ env, runner });

  logger.info('Initialising UserRoles...');
  await userRolesInitialise({ env, runner });
}