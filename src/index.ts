import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express from 'express';
import { buildSchema } from 'type-graphql';
import cookieParser from 'cookie-parser';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import {resolvers} from './resolvers'
import { connectToMongo } from './utils/mongo';
import { verifyJwt } from './utils/jwt';
import { User } from './schema/user.schema';
import Context from './types/context';
import authChecker from './utils/authChecker'

async function bootstrap(){
    // Build the Schema
    const schema = await buildSchema({
        resolvers,
        authChecker
    })

    // Init the express
    const app = express();
    app.use(cookieParser());
    // Create apollo server
    const server = new ApolloServer({
        schema,
        context: (ctx: Context) => {
            const context = ctx;
            if(ctx.req.cookies.accessToken) {
                const user = verifyJwt<User>(ctx.req.cookies.accessToken);              
                context.user = user;
            }
            return context;
        },
        plugins: [
            process.env.NODE_ENV === 'production' ? ApolloServerPluginLandingPageProductionDefault(): ApolloServerPluginLandingPageGraphQLPlayground()
        ]
    })
    // Await server.start
    await server.start();
    // Apply middleware to server
    server.applyMiddleware({app})
    // app.listen on express server
    app.listen({ port: 4000 }, () => {
        console.log('App is listening on port 4000')
    })
    // Connect to db
    await connectToMongo()
}

bootstrap()