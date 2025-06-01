import { MongoClient } from "mongodb";
import type { LogType } from "../types";
import { uri } from "./init";
import { get } from "./get";

export default async function uploadLog(new_log: LogType) {
  const client = new MongoClient(uri);

  try {
    const database = client.db("stocks");
    const collection = database.collection("bought");

    const existingLogData = await get({ type: "bought" });
    let sameTimeExisted = false;
    const updatedLogs = [...existingLogData.logs];

    for (const log of updatedLogs) {
      if (new Date(new_log.time).getTime() === new Date(log.time).getTime()) {
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
      updatedLogs.push(new_log);
    }

    const result = await collection.updateOne(
      { type: "bought" },
      {
        $set: {
          type: "bought",
          logs: updatedLogs,
        },
      },
      { upsert: true },
    );

    return result;
  } catch (error) {
    console.log(`[--ERROR--] Failed to uploadLog\n${error}`);
  } finally {
    await client.close();
  }
}

export { uploadLog };
