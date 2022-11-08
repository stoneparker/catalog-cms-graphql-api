import 'reflect-metadata';
import mongoose from 'mongoose';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import express from 'express';
import cors from 'cors';

import envConfig from './config/env';
import { authChecker } from './utils/authChecker';

import { UserResolver } from './resolvers/user';
import { ProductResolver } from './resolvers/product';
import { GraphQLContext } from './types/context';

async function startApolloServer(server: ApolloServer) {
  const { url } = await startStandaloneServer(
    server, {
    context: async ({ req }) => {
      return { token: req.headers.authorization }
    },
    listen: { port: 4000 },
  });

  console.log('Apollo server running on', url);
}

async function startStaticServer() {
  const app = express();

  app.use(cors());
  app.use('/', express.static(path.join(__dirname, 'public')));

  app.listen(Number(process.env.port) || 3333, () => console.log('Static server running on http://localhost:3333/'));
}

export async function bootstrapServer() {
  const { user, password, host } = envConfig.db;

  await mongoose.connect(`mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority`);

  const schema = await buildSchema({
    resolvers: [UserResolver, ProductResolver],
    emitSchemaFile: path.resolve(__dirname, 'public/schema.gql'),
    authChecker,
  });

  const server = new ApolloServer<GraphQLContext>({ schema, csrfPrevention: false });

  if (process.env.NODE_ENV !== 'test') {
    startApolloServer(server);
    startStaticServer();
  }

  return server;
}

bootstrapServer();
