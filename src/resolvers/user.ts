import { GraphQLError } from 'graphql';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { CreateUser } from '../dtos/inputs/user';
import { AuthReturn, User, UserModel } from '../dtos/models/user';
import envConfig from '../config/env';
import mongoose from 'mongoose';

@Resolver(() => User)
export class UserResolver {
  @Query(() => String)
  async loginUser() {
    return 'Hello World';
  }

  @Mutation(() => AuthReturn)
  async createUser(@Arg('data') data: CreateUser) {
    const userExists = await UserModel.findOne({ email: data.email });

    if (userExists) {
      throw new GraphQLError('User already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);

    const user = { _id: new mongoose.Types.ObjectId(), ...data };

    await UserModel.create(user);

    return {
      _id: user._id,
      name: user.name,
      token: jwt.sign({ ...user }, envConfig.secret, { expiresIn: '2w' }),
    };
  }
}
