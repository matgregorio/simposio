import { connectDatabase } from '../config/database';
import logger from '../config/logger';

import { runSeeds } from './index';

const seed = async () => {
  await connectDatabase();
  await runSeeds();
  logger.info('Seeds executadas com sucesso.');
  process.exit(0);
};

seed().catch((error) => {
  logger.error({ error }, 'Erro ao executar seeds');
  process.exit(1);
});
