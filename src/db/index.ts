import mongoose from 'mongoose';

export const connectToDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL)

    mongoose.connection.once("open", () => {
        console.log("MongoDB database connection established successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });
}

export const disconnectFromDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB database connection closed successfully");
    } catch (error) {
        console.error("Error disconnecting from MongoDB:", error);
    }
};