import 'reflect-metadata';
import mongoose from 'mongoose';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';

import envConfig from './config/env';
import { authChecker } from './utils/authChecker';

import { UserResolver } from './resolvers/user';
import { ProductResolver } from './resolvers/product';
import { GraphQLContext } from './types/context';

async function bootstrapServer() {
  const { user, password, host } = envConfig.db;

  await mongoose.connect(`mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority`);

  const schema = await buildSchema({
    resolvers: [UserResolver, ProductResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
    authChecker,
  });

  const server = new ApolloServer<GraphQLContext>({ schema });

  const { url } = await startStandaloneServer(
    server, {
    context: async ({ req }) => {
      return { token: req.headers.authorization }
    },
  });

  console.log('Server running on', url); 
}

bootstrapServer();
