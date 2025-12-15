import { MongoClient } from "mongodb";

const client = new MongoClient(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster-ripassino.hwd1q60.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-Ripassino`
);

export const initDB = async (cb) => {
  try {
    console.log("initdb");
    await client.connect();
    cb();
  } catch (error) {
    console.error("initDB not successful", error);
  }
};

export const getDB = (dbName) => client.db(dbName);
