import { Field, ObjectType, ID } from 'type-graphql';
import { prop, getModelForClass, index } from '@typegoose/typegoose';
import mongoose from 'mongoose';

@index({ name: 1 }, { unique: true })
@index({ barcode: 1 }, { unique: true })
@ObjectType()
export class ProductModel {
  @Field(() => ID)
  @prop()
  _id: mongoose.Types.ObjectId;

  @Field()
  @prop()
  name: string;

  @Field()
  @prop()
  barcode: string;

  @Field()
  @prop()
  price: number;

  @Field()
  @prop()
  availableQuantity: number;

  @Field()
  @prop()
  description: string;

  @Field()
  @prop()
  imageUrl: string;
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
