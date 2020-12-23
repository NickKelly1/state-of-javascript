import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction, sequelize, } = arg;
    // change published from id 50 to 60
    await sequelize.query(`UPDATE "blog_post_statuses" SET "id" = 60 WHERE "id" = 50`, { transaction, });
    // change unpublished from id 40 to 50
    await sequelize.query(`UPDATE "blog_post_statuses" SET "id" = 50 WHERE "id" = 40`, { transaction, });
    // insert approved at id 40
    const now = new Date();
    const approved = { id: 40, name: 'approved', colour: '#2FD3F5', created_at: now, updated_at: now };
    await queryInterface.bulkInsert('blog_post_statuses', [approved], { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction, sequelize, } = arg;
    // remove approved
    await sequelize.query('DELETE FROM "blog_post_statuses" WHERE id=40');
    // change unpublished from 50 to 40
    await sequelize.query(`UPDATE "blog_post_statuses" SET "id" = 40 WHERE "id" = 50`, { transaction, });
    // change published from 60 to 50
    await sequelize.query(`UPDATE "blog_post_statuses" SET "id" = 50 WHERE "id" = 60`, { transaction, });
  };
}
