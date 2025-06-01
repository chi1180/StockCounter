import { MongoClient } from "mongodb";
import type { LogType } from "../types";
import { uri } from "./init";
import { get } from "./get";
import { remove } from "./remove";

export default async function uploadLog(new_log: LogType) {
  const client = new MongoClient(uri);

  try {
    const database = client.db("stocks");
    const collection = database.collection("bought");

    const existingLogData = await get({ type: "bought" });
    let sameTimeExisted = false;

    for (const log of existingLogData.logs) {
      if (new_log.time === log.time) {
        sameTimeExisted = true;

        for (const [key, val] of Object.entries(new_log.counts)) {
          if (log.counts[key]) {
            log.counts[key] += val;
          } else {
            log.counts[key] = val;
          }
        }
      }
    }

    if (!sameTimeExisted) {
      existingLogData.logs.push(new_log);
    }

    console.log(`[--DEBUG--] New logs is ${JSON.stringify(existingLogData)}`);

    await remove({ type: "bought" });

    const result = await collection.insertOne(existingLogData);
    return result;
  } catch (error) {
    console.log(`[--ERROR--] Failed to uploadLog\n${error}`);
  } finally {
    await client.close();
  }
}

export { uploadLog };
