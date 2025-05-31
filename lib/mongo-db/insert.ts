import { MongoClient } from "mongodb";
import { uri } from "./init";
import { get } from "./get";
import { remove } from "./remove";

async function insert(type: string, document: object) {
  const client = new MongoClient(uri);

  try {
    const database = client.db("stocks");
    const collection = database.collection("bought");

    const existingDocument = await get({ type: type });

    if (type === "goods") {
      existingDocument?.goods.push(document);
    }

    await remove({ type: type });

    const result = await collection.insertOne(existingDocument);
    return result;
  } catch (error) {
    console.log(`[--ERROR--] Failed to load data\n${error}`);
  } finally {
    await client.close();
  }
}
export { insert };
