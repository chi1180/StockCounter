"use client";

import Header from "@/components/header";
import Loading from "@/components/loading";
import type { boughtLogsType, GoodsType, LogType } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Counter() {
  const [viewStyle, setViewStyle] = useState("card");
  const [tab, setTab] = useState("");

  const [stocks, setStocks] = useState<GoodsType>();
  const [logs, setLogs] = useState<boughtLogsType>();

  useEffect(() => {
    const fetchData = async () => {
      const apiResponse = await fetch("/api/database?for=stocks-counter");
      const result = await apiResponse.json();
      if (apiResponse.status === 200) {
        if (result.stocks && result.logs) {
          setLogs(result.logs.logs);

          for (const stock of result.stocks.goods) {
            for (const log of result.logs.logs) {
              if (log.counts[stock.name]) {
                stock.all -= log.counts[stock.name];
              }
            }
          }

          setStocks(result.stocks.goods);
        }
      } else {
        console.log(
          `[--ERROR--] Erroed in stocks-view fetchData\n${result.error}`,
        );
      }
    };

    fetchData();

    if (process.env.NODE_ENV !== "development") {
      const interval = setInterval(fetchData, 1000 * 3);
      return () => clearInterval(interval);
    }
  }, []);

  async function decreaseStock(targetName: string) {
    const newStocks: GoodsType = [];
    for (const stock of stocks) {
      if (stock.name === targetName && stock.all > 0) {
        stock.all--;
      }
      newStocks.push(stock);
    }

    setStocks(newStocks);

    // make log at database
    const thisTime = new Date();
    thisTime.setSeconds(0);
    thisTime.setMilliseconds(0);
    const new_log: LogType = {
      time: thisTime,
      counts: {
        [targetName]: 1,
      },
    };
    console.log(`[--DEBUG--] new log is ${JSON.stringify(new_log)}`);

    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "log",
        data: new_log,
      }),
    });

    if (!response.ok) {
      throw new Error(
        "Newwork response was not ok in app/counter/page.tsx in decreaseStock()",
      );
    }

    const result = await response.json();
    console.log("Success to save log:", result);
  }

  return (
    <>
      <Header />

      {stocks !== undefined ? (
        <main className="p-6">
          <div
            className="h-16 p-1 aspect-video rounded-full relative bg-(--light) flex items-center justify-center cursor-pointer shadow-md mb-6"
            onClick={() => {
              if (viewStyle === "card") {
                setViewStyle("tab");
                setTab(stocks.at(0)?.name || "");
              } else {
                setViewStyle("card");
              }
            }}
            onKeyUp={() => {}}
          >
            <h3 className="text-2xl pb-1">
              {viewStyle
                .at(0)
                ?.toUpperCase()
                .concat(viewStyle.slice(1, viewStyle.length))}
            </h3>
          </div>

          <div className="flex flex-wrap gap-4">
            {viewStyle === "card" ? (
              stocks.map(({ name, all }) => {
                return (
                  <div
                    key={name}
                    className="w-1/2 max-w-96 p-2 bg-white rounded-md shadow-md mb-4"
                  >
                    <h2 className="text-2xl pl-2 pb-2">{name}</h2>
                    <hr />
                    <div className="p-2">
                      <div className="flex flex-col gap-6">
                        <div className="flex gap-2 py-4 justify-center items-end">
                          <p className="text-5xl">{all}</p>
                          <p className="text-2xl">個</p>
                        </div>
                        <button
                          className="w-full aspect-square rounded-full bg-(--accent-normal) shadow-md text-3xl transition-all duration-300 hover:opacity-60 cursor-pointer"
                          type="button"
                          disabled={all === 0}
                          onClick={() => decreaseStock(name)}
                        >
                          一個売れた
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="flex h-16 p-1 bg-white w-full gap-1">
                  {stocks.map(({ name }) => {
                    return (
                      <div
                        key={name}
                        className={`h-full px-4 py-1 flex flex-col justify-center cursor-pointer hover:opacity-100 transition-all duration-300 bg-(--base) rounded-t-md ${tab === name ? "" : "opacity-60"}`}
                        onKeyUp={() => {}}
                        onClick={() => setTab(name)}
                      >
                        <p className="text-xl">{name}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full flex justify-center mt-12">
                  <div className="w-1/2 max-w-96 flex flex-col gap-6">
                    <div className="flex gap-2 py-4 justify-center items-end">
                      <p className="text-5xl">
                        {stocks.filter(({ name }) => name === tab).at(0)?.all ||
                          0}
                      </p>
                      <p className="text-2xl">個</p>
                    </div>
                    <button
                      className="w-full aspect-square rounded-full bg-(--accent-normal) shadow-md text-3xl transition-all duration-300 hover:opacity-60 cursor-pointer"
                      type="button"
                      disabled={
                        (stocks.filter(({ name }) => name === tab).at(0)?.all ||
                          0) === 0
                      }
                      onClick={() => decreaseStock(tab)}
                    >
                      一個売れた
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      ) : (
        <Loading />
      )}
    </>
  );
}
