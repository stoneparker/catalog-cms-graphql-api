import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { faker } from '@faker-js/faker';

import { GraphQLContext } from '../types/context';
import { bootstrapServer} from '../';
import { ProductModel } from '../dtos/models/product';

describe('Product integration tests', () => {
  let server: ApolloServer<GraphQLContext>;
  let productId: ProductModel;

  beforeAll(async () => {
    server = await bootstrapServer();
  });

  afterAll(() => {
    mongoose.disconnect();
    server?.stop();
  });

  it('Should create a product', async () => {
    const query = `
      mutation CreateProduct($data: ProductInput!) {
        createProduct(data: $data) {
          _id
        }
      }
    `;

    const variables = { data: {
      availableQuantity: 1,
      barcode: faker.random.words(1),
      description: faker.random.words(10),
      imageUrl: faker.image.abstract(),
      name: faker.word.noun(),
      price: 1000,
    }};

    const response = await server.executeOperation({ query, variables });

    expect(response.body.kind).toBe('single');

    if (response.body.kind === 'single') {
      const createProduct = response.body.singleResult.data?.createProduct as any;

      expect(response.body.singleResult.errors).toBeUndefined();
      expect(createProduct?._id).toBeDefined();

      productId = createProduct._id;
    }
  });

  it('Should update a product', async () => {
    const query = `
      mutation UpdateProduct($data: ProductModelInput!) {
        updateProduct(data: $data) {
          _id
        }
      }
    `;

    const variables = { data: {
      _id: productId,
      availableQuantity: 1,
      barcode: faker.random.words(1),
      description: faker.random.words(10),
      imageUrl: faker.image.abstract(),
      name: faker.word.noun(),
      price: 1000,
    }};

    const response = await server.executeOperation({ query, variables });

    expect(response.body.kind).toBe('single');

    if (response.body.kind === 'single') {
      const updateProduct = response.body.singleResult.data?.updateProduct as any;

      expect(response.body.singleResult.errors).toBeUndefined();
      expect(updateProduct?._id).toBeDefined();
    }
  });

  it('Should delete a product', async () => {
    const query = `
      mutation DeleteProduct($data: DeleteProductInput!) {
        deleteProduct(data: $data) {
          _id
        }
      }
    `;

    const variables = { data: {
      _id: productId,
    }};

    const response = await server.executeOperation({ query, variables });

    expect(response.body.kind).toBe('single');

    if (response.body.kind === 'single') {
      const deleteProduct = response.body.singleResult.data?.deleteProduct as any;

      expect(response.body.singleResult.errors).toBeUndefined();
      expect(deleteProduct?._id).toBeDefined();
    }
  });

  it('Should list all products', async () => {
    const query = `
      query ExampleQuery {
        listProducts {
          _id
          name
          barcode
          price
          availableQuantity
          description
          imageUrl
        }
      }
    `;

    const response = await server.executeOperation({ query });

    expect(response.body.kind).toBe('single');

    if (response.body.kind === 'single') {
      const listProducts = response.body.singleResult.data?.listProducts as ProductModel[]; 

      expect(response.body.singleResult.errors).toBeUndefined();

      listProducts?.forEach((product) => {
        expect(product).toMatchObject({
          _id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          imageUrl: expect.any(String),
          barcode: expect.any(String),
          availableQuantity: expect.any(Number),
        });
      });
    }
  });
});
