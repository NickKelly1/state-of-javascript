import { Model, QueryInterface, Sequelize, Transaction } from 'sequelize';
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
import { prettyQ } from './common/helpers/pretty.helper';
import { migrateUp } from './common/migration/migrate.up';
import { initNpmsModel, NpmsPackageModel } from './app/npms-package/npms-package.model';
import { initNpmsDashboardItemModel, NpmsDashboardItemModel } from './app/npms-dashboard-item/npms-dashboard-item.model';
import { initNpmsDashboardModel, NpmsDashboardModel } from './app/npms-dashboard/npms-dashboard.model';
import { NpmsPackageAssociation } from './app/npms-package/npms-package.associations';
import { NpmsPackageField } from './app/npms-package/npms-package.attributes';
import { NpmsDashboardItemField } from './app/npms-dashboard-item/npms-dashboard-item.attributes';
import { NpmsDashboardAssociation } from './app/npms-dashboard/npms-dashboard.associations';
import { NpmsDashboardField } from './app/npms-dashboard/npms-dashboard.attributes';
import { NpmsDashboardItemAssociation } from './app/npms-dashboard-item/npms-dashboard-item.associations';
import { initNpmsDashboardStatusModel, NpmsDashboardStatusModel } from './app/npms-dashboard-status/npms-dashboard-status.model';
import { NpmsDashboardStatusAssociation } from './app/npms-dashboard-status/npms-dashboard-status.associations';
import { NpmsDashboardStatusField } from './app/npms-dashboard-status/npms-dashboard-status.attributes';
import { initIntegrationModel } from './app/integration/integration.model';
import { initUserTokenModel, UserTokenModel } from './app/user-token/user-token.model';
import { initUserTokenTypeModel, UserTokenTypeModel } from './app/user-token-type/user-token-type.model';
import { UserTokenField } from './app/user-token/user-token.attributes';
import { UserTokenAssociation } from './app/user-token/user-token.associations';
import { UserTokenTypeField } from './app/user-token-type/user-token-type.attributes';
import { UserTokenTypeAssociation } from './app/user-token-type/user-token-type.associations';


/**
 * Overall database / model initialisation
 *
 * @param arg
 */
export async function initialiseDb(arg: { sequelize: Sequelize, env: EnvService; }): Promise<void> {
  const { sequelize, env } = arg;

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
      const queryInterface = sequelize.getQueryInterface();
      await queryInterface.startTransaction(transaction);
      await initialiseWithTransaction({
        env,
        sequelize,
        queryInterface,
        transaction,
      });
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
  env: EnvService;
  queryInterface: QueryInterface;
  transaction: Transaction;
}): Promise<void> {
  const {
    transaction,
    env,
    sequelize,
    queryInterface,
  } = arg;

  // ----------------------
  // --- run all migrations ---
  // ----------------------
  await migrateUp();

  // --------------
  // --- models ---
  // --------------

  // boot models
  logger.info('registering models...');
  initUserPasswordModel({ env, sequelize });
  initUserModel({ env, sequelize, });
  initRoleModel({ env, sequelize, });
  initPermissionModel({ env, sequelize, });
  initUserRoleModel({ env, sequelize, });
  initRolePermissionModel({ env, sequelize, });
  initNewsArticleStatusModel({ env, sequelize, });
  initNewsArticleModel({ env, sequelize, });
  initNpmsModel({ env, sequelize, });
  initNpmsDashboardStatusModel({ env, sequelize, });
  initNpmsDashboardModel({ env, sequelize, });
  initNpmsDashboardItemModel({ env, sequelize, });
  initIntegrationModel({ env, sequelize, });
  initUserTokenTypeModel({ env, sequelize, });
  initUserTokenModel({ env, sequelize, });


  // -----------------------
  // --- model relations ---
  // -----------------------
  logger.info('registering model relations...');

  // user
  UserModel.hasOne(UserPasswordModel, { as: UserAssociation.password, sourceKey: UserField.id, foreignKey: UserPasswordField.user_id, })
  UserModel.hasMany(UserRoleModel, { as: UserAssociation.userRoles, sourceKey: UserField.id, foreignKey: UserRoleField.user_id, })
  UserModel.belongsToMany(RoleModel, { as: UserAssociation.roles, through: UserRoleModel as typeof Model, sourceKey: UserField.id, targetKey: RoleField.id, foreignKey: UserRoleField.user_id, otherKey: UserRoleField.role_id });
  UserModel.hasMany(NewsArticleModel, { as: UserAssociation.newsArticles, sourceKey: UserField.id, foreignKey: NewsArticleField.author_id, })
  UserModel.hasMany(NpmsDashboardModel, { as: UserAssociation.npmsDashboards, sourceKey: UserField.id, foreignKey: NpmsDashboardField.owner_id, })
  UserModel.hasMany(UserTokenModel, { as: UserAssociation.userLinks, sourceKey: UserField.id, foreignKey: UserTokenField.user_id, })

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
  RolePermissionModel.belongsTo(PermissionModel, { as: RolePermissionAssociation.permission, targetKey: PermissionField.id, foreignKey: RolePermissionField.permission_id, })

  // user role
  UserRoleModel.belongsTo(UserModel, { as: UserRoleAssociation.user, targetKey: UserField.id, foreignKey: UserRoleField.user_id, });
  UserRoleModel.belongsTo(RoleModel, { as: UserRoleAssociation.role, targetKey: RoleField.id, foreignKey: UserRoleField.role_id, })

  // news article
  NewsArticleModel.belongsTo(UserModel, { as: NewsArticleAssociation.author, targetKey: UserField.id, foreignKey: NewsArticleField.author_id, })
  NewsArticleModel.belongsTo(NewsArticleStatusModel, { as: NewsArticleAssociation.status, targetKey: NewsArticleStatusField.id, foreignKey: NewsArticleField.status_id, })

  // news article status
  NewsArticleStatusModel.hasMany(NewsArticleModel, { as: NewsArticleStatusAssociation.articles, sourceKey: NewsArticleStatusField.id, foreignKey: NewsArticleField.status_id, })

  // npms packages
  NpmsPackageModel.hasMany(NpmsDashboardItemModel, { as: NpmsPackageAssociation.dashboard_items, sourceKey: NpmsPackageField.id, foreignKey: NpmsDashboardItemField.npms_package_id, })
  NpmsPackageModel.belongsToMany(NpmsDashboardModel, { as: NpmsPackageAssociation.dashboards, through: NpmsDashboardItemModel as typeof Model, sourceKey: NpmsPackageField.id, targetKey: NpmsDashboardField.id, foreignKey: NpmsDashboardItemField.npms_package_id, otherKey: NpmsDashboardItemField.dashboard_id });

  // npms dashboard status
  NpmsDashboardStatusModel.hasMany(NpmsDashboardModel, { as: NpmsDashboardStatusAssociation.dashboards, sourceKey: NpmsDashboardItemField.id, foreignKey: NpmsDashboardField.status_id, })

  // npms dashboard
  NpmsDashboardModel.hasMany(NpmsDashboardItemModel, { as: NpmsDashboardAssociation.items, sourceKey: NpmsDashboardField.id, foreignKey: NpmsDashboardItemField.dashboard_id, })
  NpmsDashboardModel.belongsTo(UserModel, { as: NpmsDashboardAssociation.owner, targetKey: UserField.id, foreignKey: NpmsDashboardField.owner_id, });
  NpmsDashboardModel.belongsToMany(NpmsPackageModel, { as: NpmsDashboardAssociation.packages, through: NpmsDashboardItemModel as typeof Model, sourceKey: NpmsDashboardField.id, targetKey: NpmsPackageField.id, foreignKey: NpmsDashboardItemField.dashboard_id, otherKey: NpmsDashboardItemField.npms_package_id });
  NpmsDashboardModel.belongsTo(NpmsDashboardStatusModel, { as: NpmsDashboardAssociation.status, targetKey: NpmsDashboardStatusField.id, foreignKey: NpmsDashboardField.status_id, })

  // npms dashboard item
  NpmsDashboardItemModel.belongsTo(NpmsPackageModel, { as: NpmsDashboardItemAssociation.package, targetKey: NpmsPackageField.id, foreignKey: NpmsDashboardItemField.npms_package_id, })
  NpmsDashboardItemModel.belongsTo(NpmsDashboardModel, { as: NpmsDashboardItemAssociation.dashboard, targetKey: NpmsDashboardField.id, foreignKey: NpmsDashboardItemField.dashboard_id, })

  // user link
  UserTokenModel.belongsTo(UserModel, { as: UserTokenAssociation.user, targetKey: UserField.id, foreignKey: UserTokenField.user_id, })
  UserTokenModel.belongsTo(UserTokenTypeModel, { as: UserTokenAssociation.type, targetKey: UserTokenTypeField.id, foreignKey: UserTokenField.type_id, })

  // user link type
  UserTokenTypeModel.hasMany(UserTokenModel, { as: UserTokenTypeAssociation.links, sourceKey: UserTokenTypeField.id, foreignKey: UserTokenField.type_id, })
}
