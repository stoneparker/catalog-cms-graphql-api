import { Query, Mutation, Resolver, Arg } from 'type-graphql';

import { Product, ProductModel, ProductIdModel } from '../dtos/models/product';
import { DeleteProductInput, GetProductInput, ProductInput, ProductModelInput } from '../dtos/inputs/product';
import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';

@Resolver(() => ProductModel)
export class ProductResolver {
  @Query(() => [ProductModel])
  async listProducts() {
    return Product.find().lean(); // implements pagination, index by name and barcode
  }

  @Query(() => ProductModel)
  // implements index by name and barcode
  async getProduct(@Arg('data') data: GetProductInput) {
    return Product.findOne(data).lean();
  }

  @Mutation(() => ProductModel)
  async createProduct(@Arg('data') data: ProductInput) {
    const productExists = await Product.findOne({
      $or: [{ name: data.name }, { barcode: data.barcode }],
    });

    if (productExists) {
      throw new GraphQLError('Already exists a product with that name or barcode');
    }

    const newProduct = await Product.create({
      _id: new mongoose.Types.ObjectId(),
      ...data
    });

    return newProduct._id;
  }

  @Mutation(() => ProductModel)
  async editProduct(@Arg('data') data: ProductModelInput) {
    const { _id: productId, ...product } = data;

    const productExists = await Product.findById(productId);

    if (!productExists) {
      throw new GraphQLError('Product not exists');
    }

    const equalProduct = await Product.findOne({
      $and: [
        { _id: { $ne: productId } },
        { $or: [{ name: data.name }, { barcode: data.barcode }] },
      ]
    });

    if (equalProduct) {
      throw new GraphQLError('Already exists a product with that name or barcode');
    }

    await Product.updateOne(
      { _id: productId },
      { $set: product },
    );

    return data;
  }

  @Mutation(() => String)
  async deleteProduct(@Arg('data') data: DeleteProductInput) {
    await Product.deleteOne({ _id: data._id });

    return data._id;
  }
}
