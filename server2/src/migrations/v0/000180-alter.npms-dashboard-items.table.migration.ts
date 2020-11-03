import { DataTypes } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";

// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;

    // create nullable col
    await queryInterface.addColumn(
      'npms_dashboard_items',
      'order',
      { type: DataTypes.INTEGER, allowNull: true, },
      { transaction },
    );

    // retrieve all records
    const [results] = await sequelize.query(`
      SELECT
        "id"
        ,"order"
        ,"npms_package_id"
      FROM
        "npms_dashboard_items"
      ORDER BY
        "npms_package_id" ASC
        ,"id" ASC
    `, { transaction });
    interface INpmsDashboardItem { id: number, order: number, npms_package_id: number, };
    // set the order of each item
    const items = results as INpmsDashboardItem[];
    const map: Map<number, INpmsDashboardItem[]> = new Map();
    items.forEach(item => {
      let current = map.get(item.npms_package_id);
      if (!current) {
        current = [];
        map.set(item.npms_package_id, current);
      }
      current.push(item);
    });
    map.forEach((pkg) => { pkg.forEach((item, i) => item.order = i); });

    for (const item of items) {
      // initialise column
      await sequelize.query(
        `UPDATE "npms_dashboard_items" SET "order" = $1 WHERE "id" = $2;`,
        { bind: [item.order, item.id,], transaction, },
      )
    }

    // make column required
    await queryInterface.changeColumn(
      'npms_dashboard_items',
      'order',
      { type: DataTypes.INTEGER, allowNull: false, },
      { transaction },
    );
  }

  down = async (arg: IMigrationDownArg) => {
    const { env, queryInterface, sequelize, transaction } = arg;
    await queryInterface.removeColumn('npms_dashboard_items', 'order', { transaction });
  };
};