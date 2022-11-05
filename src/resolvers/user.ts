import { Query, Resolver } from 'type-graphql';

@Resolver(() => String)
export class UserResolver {
  @Query(() => String)
  async loginUser() {
    return 'Hello World';
  }
}
