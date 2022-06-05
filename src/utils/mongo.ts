import mongoose from "mongoose";import config from 'config'
import uri from '../config/default'

export async function connectToMongo() {
    try {
        await mongoose.connect(uri.dbUri);
        console.log('Connected to DB');
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}