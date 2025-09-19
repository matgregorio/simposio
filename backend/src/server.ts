import app from './app';
import { connectDatabase } from './config/database';
import env from './config/env';
import logger from './config/logger';

const start = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    logger.info(`🚀 API ouvindo na porta ${env.PORT}`);
  });
};

start().catch((error) => {
  logger.error({ error }, 'Erro ao iniciar servidor');
  process.exit(1);
});
