import express from 'express';

import 'express-async-errors';

import cookieSession from 'cookie-session';

import { NotFoundError, errorHandler } from '@jordanjordanb-portfolio/common';
import { loadRoutes } from './helpers';

async function loadApp() {
  const app = express();
  const router = express.Router();

  app.set('trust proxy', true);

  app.use(express.json());
  app.use(
    cookieSession({
      signed: false,
      secure: false,
    })
  );

  // Loads all routes
  await loadRoutes(router, './routes');

  app.use('/api/projects', router);

  app.get('*', async () => {
    throw new NotFoundError();
  });

  app.use(errorHandler);

  return app;
}

export { loadApp };
