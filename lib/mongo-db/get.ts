import { MongoClient } from "mongodb";
import { uri } from "./init";

async function get(query: object) {
  const client = new MongoClient(uri);

  try {
    const database = client.db("stocks");
    const collection = database.collection("bought");
    const result = await collection.findOne(query);
    return result;
  } catch (error) {
    console.log(`[--ERROR--] Failed to load data\n${error}`);
  } finally {
    await client.close();
  }
}

export { get };
