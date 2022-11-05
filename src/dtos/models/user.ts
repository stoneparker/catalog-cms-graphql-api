import { Field, ObjectType, ID } from 'type-graphql';
import { prop, getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';

@ObjectType()
export class User {
  @Field(() => ID)
  @prop()
  _id: mongoose.Types.ObjectId;

  @Field()
  @prop()
  email: string;

  @prop()
  password: string;

  @Field()
  @prop()
  name: string;
}

@ObjectType()
export class AuthReturn {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Field()
  token: string;

  @Field()
  name: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
});
