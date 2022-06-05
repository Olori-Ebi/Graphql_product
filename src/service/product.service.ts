import { CreateProductInput, GetProductInput, ProductModel } from "../schema/product.schema";
import { User } from "../schema/user.schema";

class ProductService {
 async createProduct(input: CreateProductInput & { user: User['_id']}) {
    return ProductModel.create(input)
 }

 async findProducts() {
    return await ProductModel.find().lean()
 }

 async findProduct(input: GetProductInput) {
    return await ProductModel.findById(input.productId).lean()
 }
}

export default ProductService;