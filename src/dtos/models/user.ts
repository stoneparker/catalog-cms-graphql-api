import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  password: string;

  @Field()
  name: string;
}

@ObjectType()
export class AuthReturn {
  @Field(() => ID)
  id: string;

  @Field()
  token: string;

  @Field()
  name: string;
}
