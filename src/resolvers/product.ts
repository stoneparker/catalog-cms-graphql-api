import { Query, Resolver } from 'type-graphql';

@Resolver(() => String)
export class ProductResolver {
  @Query(() => String)
  async listProducts() {
    return 'Hello World';
  }
}
