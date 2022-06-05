import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateProductInput, GetProductInput, Product } from "../schema/product.schema";
import ProductService from "../service/product.service";
import Context from "../types/context";


@Resolver()
export default class ProductResolver {
    constructor(private productService: ProductService){
        this.productService = new ProductService();
    }

    @Authorized()
    @Mutation(() => Product)
    async createProduct(@Arg('input') input: CreateProductInput, @Ctx() context: Context) {
       const user = context.user!
        return await this.productService.createProduct({...input, user: user?._id})
    }

    @Authorized()
    @Query(() => [Product])
    async getProducts() {
        return await this.productService.findProducts()
    }
    
    @Authorized()
    @Query(() => Product)
    async getProduct(@Arg('input') input: GetProductInput) {
        return await this.productService.findProduct(input)
    }

}