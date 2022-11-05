import { Field, ObjectType, ID, InputType } from 'type-graphql';
import { prop, getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';

import { ProductInput } from '../inputs/product';

@ObjectType()
export class ProductModel extends ProductInput {
  @Field(() => ID)
  @prop()
  _id: mongoose.Types.ObjectId;
}

@ObjectType()
export class ProductIdModel {
  @Field()
  _id: String;
}


export const Product = getModelForClass(ProductModel, {
  schemaOptions: {
    collection: 'products',
    timestamps: true,
  }
});
