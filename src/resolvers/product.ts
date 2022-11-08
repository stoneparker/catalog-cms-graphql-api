import { Query, Mutation, Resolver, Arg, Authorized } from 'type-graphql';
import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';

import { Product, ProductModel, ProductIdModel } from '../dtos/models/product';
import { DeleteProductInput, GetProductInput, ProductInput, ProductModelInput } from '../dtos/inputs/product';

@Resolver(() => ProductModel)
export class ProductResolver {
  @Authorized()
  @Query(() => [ProductModel])
  async listProducts() {
    return Product.find().sort({ name: -1 }).lean(); // implements pagination, index by name and barcode
  }

  @Authorized()
  @Query(() => ProductModel)
  // implements index by name and barcode
  async getProduct(@Arg('data') data: GetProductInput) {
    return Product.findOne({ $or: [{ name: data.name }, { barcode: data.barcode }] }).lean();
  }

  @Authorized()
  @Mutation(() => ProductIdModel)
  async createProduct(@Arg('data') data: ProductInput) {
    const productExists = await Product.findOne({
      $or: [{ name: data.name }, { barcode: data.barcode }],
    });

    if (productExists) {
      throw new GraphQLError(
        'Already exists a product with that name or barcode',
        { extensions: {
          code: 'BAD_USER_INPUT',
          http: { status: 400 },
        } },
      );
    }

    const newProduct = await Product.create({
      _id: new mongoose.Types.ObjectId(),
      ...data
    });

    return { _id: newProduct._id };
  }

  @Authorized()
  @Mutation(() => ProductIdModel)
  async updateProduct(@Arg('data') data: ProductModelInput) {
    const { _id: productId, ...product } = data;

    const productExists = await Product.findById(productId);

    if (!productExists) {
      throw new GraphQLError(
        'Product not exists',
        { extensions: {
          code: 'BAD_USER_INPUT',
          http: { status: 400 },
        } },
      );
    }

    const equalProduct = await Product.findOne({
      $and: [
        { _id: { $ne: productId } },
        { $or: [{ name: data.name }, { barcode: data.barcode }] },
      ]
    });

    if (equalProduct) {
      throw new GraphQLError(
        'Already exists a product with that name or barcode',
        { extensions: {
          code: 'BAD_USER_INPUT',
          http: { status: 400 },
        } },
      );
    }

    await Product.updateOne(
      { _id: productId },
      { $set: product },
    );

    return { _id: data._id };
  }

  @Authorized()
  @Mutation(() => ProductIdModel)
  async deleteProduct(@Arg('data') data: DeleteProductInput) {
    await Product.deleteOne({ _id: data._id });

    return { _id: data._id };
  }
}
