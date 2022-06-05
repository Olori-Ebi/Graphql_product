import { ApolloError } from "apollo-server";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import Context from "../types/context";
import bcrypt from 'bcrypt'
import { signJwt } from "../utils/jwt";

class UserService {
    async createUser(input: CreateUserInput) {
        return await UserModel.create(input)
    }

    async login(input: LoginInput, context: Context) {
        // Get user by email
        const user = await UserModel.find().findByEmail(input.email).lean();
        
        if(!user) {
            throw new ApolloError('Invalid credentials')
        }
        // validate password
        const passwordIsValid = await bcrypt.compare(input.password, user.password);
        if(!passwordIsValid) {
            throw new ApolloError('Invalid credentials')
        }
        // sign a jwt
        const token = signJwt(user)
        
        // set a cookie for jwt
        context.res.cookie('accessToken', token, {
            maxAge: 3.154e10, // 1 year
            httpOnly: true,
            domain: 'localhost',
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production"
        })
        //return jwt
        return token;
    }
}

export default UserService;