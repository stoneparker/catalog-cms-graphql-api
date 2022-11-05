import 'reflect-metadata';

import path from 'node:path';

import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import { ProductResolver } from './resolvers/product';

async function bootstrapServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver, ProductResolver],
    emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  });

  const server = new ApolloServer({ schema });

  const { url } = await server.listen();

  console.log('Server running on', url); 
}

bootstrapServer();
