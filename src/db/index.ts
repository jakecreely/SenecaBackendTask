import mongoose from 'mongoose';
import 'dotenv/config'
import { DatabaseError, DatabaseErrorCodes } from '../errors/DatabaseError';

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB database connection established successfully");
    } catch (error) {
        throw new DatabaseError('Failed to connect to MongoDB', DatabaseErrorCodes.CONNECTION_ERROR)
    }
}

export const disconnectFromDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB database connection closed successfully");
    } catch (error) {
        throw new DatabaseError('Failed to disconnect from MongoDB', DatabaseErrorCodes.DISCONNECT_ERROR)
    }
};