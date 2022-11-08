import { GraphQLError } from 'graphql';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { LoginUser, CreateUser } from '../dtos/inputs/user';
import { AuthReturn, User, UserModel } from '../dtos/models/user';
import envConfig from '../config/env';

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => AuthReturn)
  async loginUser(@Arg('data') data: LoginUser) {
    const user = await UserModel.findOne({ email: data.email }).lean();

    if (!user) {
      throw new GraphQLError(
        'Wrong email or password',
        { extensions: {
          code: 'UNAUTHORIZED',
          http: { status: 401 },
        }},
      );
    }

    const passwordCheck = bcrypt.compareSync(data.password, user.password);
    
    if (!passwordCheck) {
      throw new GraphQLError(
        'Wrong email or password',
        { extensions: {
          code: 'UNAUTHORIZED',
          http: { status: 401 },
        }},
      );
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ ...user }, envConfig.secret, { expiresIn: '2w' }),
    };
  }

  @Mutation(() => AuthReturn)
  async createUser(@Arg('data') data: CreateUser) {
    const userExists = await UserModel.findOne({ email: data.email });

    if (userExists) {
      throw new GraphQLError(
        'User already exists',
        { extensions: {
          code: 'BAD_REQUEST',
          http: { status: 400 },
        }},
      );
    }

    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);

    const user = { _id: new mongoose.Types.ObjectId(), ...data };

    await UserModel.create(user);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ ...user }, envConfig.secret, { expiresIn: '2w' }),
    };
  }
}
