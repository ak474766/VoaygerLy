import mongoose from "mongoose";

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDb() {

    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise){
        const opts = {
            bufferCommands:false
        }
        const uri = process.env.MONGODB_URI;
        if (!uri || typeof uri !== 'string' || !uri.startsWith('mongodb')) {
            throw new Error("MONGODB_URI is not set or is invalid. Please set a valid MongoDB connection string in your .env file.");
        }
        cached.promise = mongoose
            .connect(uri, opts)
            .then(mongoose => {
                return mongoose;
            });
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default connectDb
