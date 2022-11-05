import { Field, InputType, ID } from 'type-graphql';
import { prop } from '@typegoose/typegoose';

@InputType()
export class GetProductInput {
  @Field()
  name: string;

  @Field()
  barcode: string;
}

@InputType()
export class ProductInput {
  @Field()
  @prop()
  name: string;

  @Field()
  @prop()
  barcode: string;

  @Field()
  @prop()
  price: string;

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

@InputType()
export class DeleteProductInput {
  @Field(() => ID)
  @prop()
  _id: string;
}

@InputType()
export class ProductModelInput extends ProductInput {
  @Field(() => ID)
  @prop()
  _id: string;
}
