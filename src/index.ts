import mongoose from 'mongoose';
import config from './config';
import { loadApp } from './app';
import { natsWrapper } from './nats-wrapper';

console.log('Starting...');

(async () => {
  if (!config.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if (!config.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  if (!config.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  if (!config.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  await natsWrapper.connect(config.NATS_CLUSTER_ID, config.NATS_CLIENT_ID, config.NATS_URL);

  natsWrapper.stan.on('close', () => {
    console.log('NATS connection closed');

    process.exit();
  });

  process.on('SIGINT', () => natsWrapper.stan.close());
  process.on('SIGTERM', () => natsWrapper.stan.close());

  await mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  const app = await loadApp();

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
})();
