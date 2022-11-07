import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { faker } from '@faker-js/faker';

import { GraphQLContext } from '../types/context';
import { bootstrapServer} from '../';
import { CreateUser } from '../dtos/inputs/user';

describe('User integration tests', () => {
  let server: ApolloServer<GraphQLContext>;
  let user: CreateUser;

  beforeAll(async () => {
    server = await bootstrapServer();
    user = {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  });

  afterAll(() => {
    mongoose.disconnect();
    server?.stop();
  });

  it('Should create an user', async () => {
    const query = `
      mutation CreateUser($data: CreateUser!) {
        createUser(data: $data) {
          _id
          token
          name
          email
        }
      }
    `;

    const variables = { data: user };

    const response = await server.executeOperation({ query, variables });

    expect(response.body.kind).toBe('single');

    if (response.body.kind === 'single') {
      const createUser = response.body.singleResult.data?.createUser as any;

      expect(response.body.singleResult.errors).toBeUndefined();

      expect(createUser).toMatchObject({
        _id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        token: expect.any(String),
      });
    }
  });

  it('Should login an user', async () => {
    const query = `
      mutation LoginUser($data: LoginUser!) {
        loginUser(data: $data) {
          _id
          token
          name
          email
        }
      }
    `;

    const variables = { data: {
      email: user.email,
      password: user.password,
    }};

    const response = await server.executeOperation({ query, variables });

    expect(response.body.kind).toBe('single');

    if (response.body.kind === 'single') {
      const loginUser = response.body.singleResult.data?.loginUser as any;

      expect(response.body.singleResult.errors).toBeUndefined();

      expect(loginUser).toMatchObject({
        _id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        token: expect.any(String),
      });
    }
  });
});
