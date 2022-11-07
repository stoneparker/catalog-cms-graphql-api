import 'reflect-metadata';
import mongoose from 'mongoose';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
// import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';

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

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<GraphQLContext>({ schema, plugins: [ApolloServerPluginDrainHttpServer({ httpServer })] });

  await server.start();

  app.use(
    '/',
    cors<cors.CorsRequest>({ origin: '*' }),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.authorization }),
    }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`Server running on http://localhost:4000/`);

  // const { url } = await startStandaloneServer(
  //   server, {
  //   context: async ({ req }) => {
  //     return { token: req.headers.authorization }
  //   },
  // });

  // console.log('Server running on', url); 
}

bootstrapServer();
