import mongoose from 'mongoose';

export const startDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL)

    mongoose.connection.once("open", function () {
        console.log("MongoDB database connection established successfully");
    });
}