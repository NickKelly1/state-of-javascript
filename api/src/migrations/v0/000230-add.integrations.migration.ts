import { Op } from "sequelize";
import { IMigration, IMigrationDownArg, IMigrationUpArg } from "../../common/migration/migration.interface";
import crypto from 'crypto';

interface IMigrationIntegration {
  id: number;
  name: string;
  iv: string;
  encrypted_init: null | string;
  encrypted_state: null | string;
  public: null | string,
  is_connected: boolean;
  error: null | string;
  created_at: Date;
  updated_at: Date;
}

const now = new Date();

function getData() {
  // TODO: update policies & gql actions & permission const names (keys)...
  const integrations: IMigrationIntegration[] = [
    // gmail
    {
      id: 10,
      name: 'google',
      iv: crypto.randomBytes(16).toString('hex'),
      encrypted_init: null,
      encrypted_state: null,
      error: null,
      is_connected: false,
      public: 'uninitialised',
      created_at: now,
      updated_at: now,
    },
  ];

  return {
    integrations,
  };
}


// name for debugging purposes only
export default class implements IMigration {
  tag = __filename;

  up = async (arg: IMigrationUpArg): Promise<void> => {
    const { queryInterface, transaction } = arg;
    const { integrations } = getData();
    await queryInterface.bulkInsert('integrations', integrations, { transaction });
  }

  down = async (arg: IMigrationDownArg): Promise<void> => {
    const { queryInterface, transaction, } = arg;
    const { integrations } = getData();
    await queryInterface.bulkDelete(
      'integrations',
      { id: { [Op.in]: integrations.map(int => int.id) }, },
      { transaction },
    );
  };
}
