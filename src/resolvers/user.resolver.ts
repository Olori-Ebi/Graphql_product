import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput, LoginInput, User } from "../schema/user.schema";
import UserService from "../service/user.service";
import Context from "../types/context";

@Resolver()
export default class UserResolver {
    constructor(private userService: UserService) {
        this.userService = new UserService();
    }

    @Mutation(() => User)
    async createUser(@Arg('input') input: CreateUserInput) {
       return await this.userService.createUser(input)
    }

    @Mutation(() => String) // Returns jwt
    async login(@Arg('input') input: LoginInput, @Ctx() context: Context) {
       return await this.userService.login(input, context)
    }
    @Query(() => User)
    hello(@Ctx() context: Context) {
        return context.user
    }
}