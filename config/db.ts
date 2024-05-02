import mongodb from "mongodb";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(String(uri));

const connectDB = async () => {
  try {
    const conn = await client.connect();
    console.log("Connected to MongoDb");
    return client.db();
  } catch (error) {
    console.log({ error: error });
  }
};

const conn = connectDB()
export default conn ;
