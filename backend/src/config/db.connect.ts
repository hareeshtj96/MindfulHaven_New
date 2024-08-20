import mongoose from "mongoose";

mongoose.set("strictQuery", true);

interface Config {
    mongo: {
        uri: string;
    };
}

const connectDB = async (config: any): Promise<void> => {
    try {
        const { uri } = config.mongo;
        await mongoose.connect(uri);
        console.log("connected to mongodb")
    } catch (error) {
        console.error("error connecting to mongodb database");
        process.exit(1)
    }
}

export default connectDB;