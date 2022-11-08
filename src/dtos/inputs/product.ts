import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field()
  barcode: string;

  @Field()
  price: number;

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
