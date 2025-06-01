import { MongoClient } from "mongodb";
import { uri } from "./init";
import { get } from "./get";
import { remove } from "./remove";
import type { boughtLogsType, GoodsType, StockType } from "../types";

async function insert(
  type: string,
  document: StockType,
  is_exist?: boolean,
  is_delete?: boolean,
) {
  const client = new MongoClient(uri);

  try {
    const database = client.db("stocks");
    const collection = database.collection("bought");

    const existingDocument = await get({ type: type });

    if (type === "goods") {
      if (is_exist) {
        existingDocument.goods.forEach((good: StockType, index: number) => {
          if (good.name === document.name) {
            existingDocument.goods[index].price = document.price;
            existingDocument.goods[index].all = document.all;
          }
        });
      } else if (is_delete) {
        const newGoods: GoodsType = [];
        for (const stock of existingDocument.goods) {
          if (stock.name !== document.name) {
            newGoods.push(stock);
          }
        }
        existingDocument.goods = newGoods;

        // remove log data
        const boughtData = await get({ type: "bought" });
        const newLog: boughtLogsType = [];
        for (const log of boughtData.logs) {
          if (log.counts[document.name]) delete log.counts[document.name];
          newLog.push(log);
        }

        await remove({ type: "bought" });

        await collection.insertOne({
          type: "bought",
          logs: newLog,
        });
      } else {
        existingDocument?.goods.push(document);
      }
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
