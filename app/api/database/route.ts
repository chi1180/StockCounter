import type { MutableDataPoint } from "@/components/props";
import { get } from "@/lib/mongo-db/get";
import { insert } from "@/lib/mongo-db/insert";
import type { GoodsType } from "@/lib/types";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get("for");

  switch (target) {
    case "bought-graph":
      try {
        const goods_data = await get({ type: "goods" });
        const bought = await get({ type: "bought" });
        const logs = bought?.logs || [];

        const good_names: Array<string> = [];
        const graphData = [];

        if (logs?.length > 0) {
          for (const log of logs) {
            if (log) {
              const logCounts: MutableDataPoint = {
                ...log.counts,
                time: log.time,
              };

              if (goods_data) {
                for (const good of goods_data.goods as GoodsType) {
                  if (good?.name) {
                    if (!good_names.includes(good.name)) {
                      good_names.push(good.name);
                    }

                    if (!logCounts[good.name]) {
                      logCounts[good.name] = 0;
                    }
                  }
                }
              }

              graphData.push(logCounts);
            }
          }
        }

        return new Response(
          JSON.stringify({
            graphData: graphData,
            good_names: good_names,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        console.error("Error in bought-data API route:", error);
        return new Response(JSON.stringify({ error: error }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

    case "stocks-view":
      try {
        const goods_data = await get({ type: "goods" });

        return new Response(
          JSON.stringify({
            stocks: goods_data,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      } catch (error) {
        console.error("Error in stocks-view API route:", error);
        return new Response(JSON.stringify({ error: error }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    console.log("受信したデータ:", JSON.stringify([type, data]));

    switch (type) {
      case "goods":
        insert(type, data);
        break;
    }

    return Response.json({
      message: "データを正常に受信しました",
      receivedData: { type, data },
    });
  } catch (error) {
    return Response.json(
      { error: "[-- ERROR --] Erroed when POST in database api router" },
      { status: 500 },
    );
  }
}
