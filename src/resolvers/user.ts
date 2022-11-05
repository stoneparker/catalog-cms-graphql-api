import { randomUUID } from 'node:crypto';
import { GraphQLError } from 'graphql';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { CreateUser } from '../dtos/inputs/user';
import { AuthReturn, User } from '../dtos/models/user';
import { Storage } from '../storage';
import envConfig from '../config/env';

@Resolver(() => User)
export class UserResolver {
  @Query(() => String)
  async loginUser() {
    return 'Hello World';
  }

  @Mutation(() => AuthReturn)
  async createUser(@Arg('data') data: CreateUser) {
    const userExists = Storage.getUsers().some((user) => user.email === data.email);

    console.log(userExists, Storage.getUsers());
    if (userExists) {
      throw new GraphQLError('User already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);

    const user = { id: randomUUID(), ...data }

    Storage.setUsers([...Storage.getUsers(), user]);

    return {
      id: user.id,
      name: user.name,
      token: jwt.sign({ ...user }, envConfig.secret, { expiresIn: '2w' }),
    };
  }
}
