"use client";

import Footer from "@/components/Footer";
import Header from "@/components/header";
import Loading from "@/components/loading";
import type { LogType, StockType } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Counter() {
  const [stocksData, setStocksData] = useState<StockType[]>();
  const [processingStocks, setProcessingStocks] = useState<Set<string>>(
    new Set(),
  );
  const [stockViewStyle, setStockViewStyle] = useState<"card" | "tab">("card");
  const [tabTargetStock, setTabTargetStock] = useState("");
  const [visibleStocks, setVisibleStocks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();

    if (process.env.NODE_ENV !== "development") {
      const intervalFetcFunc = setInterval(fetchData, 1000);
      return () => clearInterval(intervalFetcFunc);
    }
  }, []);

  async function fetchData() {
    try {
      const apiResponse = await fetch("api/database?for=stocks-counter");

      if (apiResponse.status === 200) {
        const result = await apiResponse.json();

        if (result.stocks && result.logs) {
          for (const stock of result.stocks.goods) {
            for (const log of result.logs.logs) {
              if (log.counts[stock.name]) stock.all -= log.counts[stock.name];
              // if (processingStocks.has(stock.name)) stock.all--;
            }
          }

          setStocksData(result.stocks.goods);
        } else {
          console.log(
            `[---ERROR---] Error in fetchData function with:\n${result.error}`,
          );
        }
      }
    } catch (error) {
      console.log(`[---ERROR---] Failed to fetch data:\n${error}`);
    }
  }

  async function decreaseStock(targetStockName: string) {
    if (processingStocks.has(targetStockName)) {
      console.log(
        `[--DEBUG--] ${targetStockName} is already processing. This request will return.`,
      );
      return;
    }

    setProcessingStocks((prev) => new Set(prev).add(targetStockName));

    /** Modifiering DB data */
    try {
      const thisTime = new Date();
      thisTime.setSeconds(0);
      thisTime.setMilliseconds(0);
      const new_log: LogType = {
        time: thisTime,
        counts: {
          [targetStockName]: 1,
        },
      };

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

      if (!response.ok)
        throw new Error(
          `Internal API response was not ok: ${response.status}\n${response.statusText}`,
        );

      const result = await response.json();
      console.log(
        `[--INFO--] Successfully saved log as:\n${JSON.stringify(result)}`,
      );
    } catch (error) {
      console.log(
        `[--ERROR--] Failed to decrease stock for ${targetStockName} with:\n${error}`,
      );
      alert(`在庫の更新に失敗しました: ${targetStockName}`);
    } finally {
      await fetchData();

      setProcessingStocks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(targetStockName);
        return newSet;
      });

      console.log(`[--DEBUG--] Processing complete for ${targetStockName}`);
    }
  }

  return (
    <>
      <Header />

      {stocksData ? (
        <main className="p-3 sm:p-6">
          {/* Stock view change button */}
          <div
            className="h-12 sm:h-16 p-0.5 sm:p-1 aspect-video rounded-full relative bg-(--light) flex items-center justify-center cursor-pointer shadow-md mb-3 sm:mb-6"
            onClick={() => {
              if (stockViewStyle === "card") {
                setStockViewStyle("tab");
                setTabTargetStock(stocksData.at(0).name || "");
              } else {
                setStockViewStyle("card");
              }
            }}
            onKeyUp={() => {}}
          >
            <h3 className="text-xl sm:text-2xl pb-0.5 sm:pb-1">
              {stockViewStyle
                .at(0)
                .toUpperCase()
                .concat(stockViewStyle.slice(1, stockViewStyle.length))}
            </h3>
          </div>

          {/* Visible stock cards selector */}
          {stockViewStyle === "card" && (
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-6">
              {stocksData.map(({ name }) => (
                <label key={name} className="flex items-center gap-1 sm:gap-2">
                  <input
                    type="checkbox"
                    checked={visibleStocks.has(name)}
                    onChange={(event) => {
                      const modifiedVisibleStocks = new Set(visibleStocks);
                      event.target.checked
                        ? modifiedVisibleStocks.add(name)
                        : modifiedVisibleStocks.delete(name);
                      setVisibleStocks(modifiedVisibleStocks);
                    }}
                  />
                  <span className="text-xl sm:text-2xl">{name}</span>
                </label>
              ))}
            </div>
          )}

          {/* Stock cards container */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {stockViewStyle === "card" ? (
              stocksData
                .filter(({ name }) => visibleStocks.has(name))
                .map(({ name, all }) => {
                  const isDisabled = processingStocks.has(name);
                  return (
                    /** Stock card */
                    <div
                      key={name}
                      className="w-[calc(50%-10px)] sm:w-1/2 max-w-96 p-1 sm:p-2 bg-white rounded-md shadow-md mb-2 sm:mb-4"
                    >
                      <h2 className="text-2xl sm:text-3xl pl-1 sm:pl-2 pb-1 sm:pb-2">
                        {name}
                      </h2>
                      <hr />
                      <div className="p-1 sm:p-2">
                        <div className="flex flex-col gap-3 sm:gap-6">
                          {/* Stock remaining amount */}
                          <div className="flex gap-1 sm:gap-2 py-2 sm:py-4 justify-center items-end">
                            <p className="text-3xl sm:text-5xl">{all}</p>
                            <p className="text-xl sm:text-2xl">個</p>
                          </div>

                          {/* Counter button */}
                          <button
                            className={`w-full aspect-square rounded-full shadow-md text-2xl sm:text-3xl transition-all duration-300 cursor-pointer ${isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-(--accent-normal) hover:opacity-60"}`}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => {
                              decreaseStock(name);
                            }}
                          >
                            {isDisabled ? "処理中..." : "一個売れた"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <>
                {/* Tab */}
                <div className="flex flex-wrap p-0.5 sm:p-1 bg-white w-full gap-0.5 sm:gap-1">
                  {stocksData.map(({ name }) => (
                    <div
                      key={name}
                      className={`h-10 sm:h-14 px-2 sm:px-4 py-0.5 sm:py-1 flex flex-col justify-center cursor-pointer hover:opacity-100 transition-all duration-300 bg-(--base) rounded-t-md ${tabTargetStock !== name && "opacity-60"}`}
                      onKeyUp={() => {}}
                      onClick={() => setTabTargetStock(name)}
                    >
                      <p className="text-xl sm:text-2xl">{name}</p>
                    </div>
                  ))}
                </div>

                {/* Counter */}
                <div className="w-full flex justify-center m- sm:mt-12">
                  <div className="w-full sm:w-1/2 max-w-96 flex flex-col ggp-3 sm:gap-6">
                    {(() => {
                      const currentStock = stocksData
                        .filter(({ name }) => name === tabTargetStock)
                        .at(0);
                      const isDisabled = processingStocks.has(
                        currentStock.name,
                      );

                      return (
                        <>
                          {/* Stock remaining amount */}
                          <div className="flex gap-1 sm:gap-2 py-2 sm:py-4 justify-center items-end">
                            <p className="text-5xl">{currentStock.all}</p>
                            <p className="text-xl sm:text-2xl">個</p>
                          </div>

                          {/* Counter button */}
                          <button
                            className={`w-full aspect-square rounded-full shadow-md text-3xl transition-all duration-300 cursor-pointer ${isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-(--accent-normal) hover:opacity-60"}`}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => {
                              decreaseStock(currentStock.name);
                            }}
                          >
                            {isDisabled ? "処理中" : "一個売れた"}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      ) : (
        <Loading />
      )}

      <Footer />
    </>
  );
}
