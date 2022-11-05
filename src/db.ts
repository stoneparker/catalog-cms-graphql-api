import mongoose, { Connection } from 'mongoose';

import envConfig from './config/env';

export class DbConnection {
  private static connection: Connection;

  constructor() {
    const { user, password, host } = envConfig.db;

    const connection = mongoose.createConnection(`mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    DbConnection.bootstrap(connection);
  }

  private static bootstrap(connection: Connection) {
    connection.on('open', () => {
      console.info('Connected with MongoDB');
      this.connection = connection;
    });

    connection.on('disconnected', () => {
      console.info('Disconnected from MongoDB');
    });

    connection.on('reconnected', () => {
      console.info('Reconnected with MongoDB');
    });

    connection.on('reconnecting', () => {
      console.info('Trying to reconnect with MongoDB');
    });

    connection.on('error', () => {
      console.error('Error with MongoDB connection');
    });
  }

  static get() {
    if (!this.connection) {
      throw new Error('No connection to the MongoDB');
    }

    return this.connection;
  }
}
