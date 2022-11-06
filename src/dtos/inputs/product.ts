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
  name: string;

  @Field()
  barcode: string;

  @Field()
  price: string;

  @Field()
  availableQuantity: number;

  @Field()
  description: string;

  @Field()
  imageUrl: string;
}

@InputType()
export class DeleteProductInput {
  @Field(() => ID)
  _id: string;
}

@InputType()
export class ProductModelInput extends ProductInput {
  @Field(() => ID)
  _id: string;
}
