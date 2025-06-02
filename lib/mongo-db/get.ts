import { MongoClient } from "mongodb";
import { uri } from "./init";

async function get(query: { type: string; [key: string]: any }) {
  const client = new MongoClient(uri);

  try {
    const database = client.db("stocks");
    const collectionName = query.type === "goods" ? "goods" : "bought";
    const collection = database.collection(collectionName);
    const result = await collection.findOne(query);
    return result;
  } catch (error) {
    console.error(`[--ERROR--] Failed to load data\n${error}`);
    throw error; // エラーを上位に伝播させる
  } finally {
    await client.close();
  }
}
export { get };
