"use client";

import Header from "@/components/header";
import Loading from "@/components/loading";
import type { GoodsType, LogType } from "@/lib/types";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Counter() {
  const [viewStyle, setViewStyle] = useState("card");
  const [tab, setTab] = useState("");
  const [stocks, setStocks] = useState<GoodsType>();
  const [isProcessing, setIsProcessing] = useState<Set<string>>(new Set());
  const [visibleStocks, setVisibleStocks] = useState<Set<string>>(new Set());
  const isUpdating = useRef(0);
  const fetchIdRef = useRef(0);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (stocks && !isInitialized.current) {
      setVisibleStocks(new Set(stocks.map((stock) => stock.name)));
      isInitialized.current = true;
    }
  }, [stocks]);

  const fetchData = useCallback(async (forceUpdate = false) => {
    if (!forceUpdate && isUpdating.current > 0) return;

    const currentFetchId = ++fetchIdRef.current;
    console.log(`[--DEBUG--] Starting fetchData with ID: ${currentFetchId}`);

    try {
      const apiResponse = await fetch("/api/database?for=stocks-counter");
      const result = await apiResponse.json();

      if (currentFetchId !== fetchIdRef.current) {
        console.log(
          `[--DEBUG--] Ignoring outdated fetch result (ID: ${currentFetchId}, current: ${fetchIdRef.current})`,
        );
        return;
      }

      if (apiResponse.status === 200) {
        if (result.stocks && result.logs) {
          for (const stock of result.stocks.goods) {
            for (const log of result.logs.logs) {
              if (log.counts[stock.name]) {
                stock.all -= log.counts[stock.name];
              }
            }
          }

          console.log(
            `[--DEBUG--] Applying fetch result (ID: ${currentFetchId})`,
          );
          setStocks(result.stocks.goods);
        }
      } else {
        console.log(
          `[--ERROR--] Error in stocks-view fetchData\n${result.error}`,
        );
      }
    } catch (error) {
      console.error("[--ERROR--] Failed to fetch data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();

    if (process.env.NODE_ENV !== "development") {
      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
    }
  }, [fetchData]);

  const decreaseStock = useCallback(
    async (targetName: string) => {
      if (isProcessing.has(targetName)) {
        console.log(`[--DEBUG--] ${targetName} is already being processed`);
        return;
      }

      const currentStock = stocks?.find((stock) => stock.name === targetName);
      if (!currentStock || currentStock.all <= 0) {
        console.log(`[--DEBUG--] ${targetName} is out of stock`);
        return;
      }

      setIsProcessing((prev) => new Set([...prev, targetName]));
      isUpdating.current++;

      try {
        const thisTime = new Date();
        thisTime.setSeconds(0);
        thisTime.setMilliseconds(0);
        const new_log: LogType = {
          time: thisTime,
          counts: {
            [targetName]: 1,
          },
        };

        console.log(`[--DEBUG--] Saving log: ${JSON.stringify(new_log)}`);

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
            `Network response was not ok: ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();
        console.log("[--DEBUG--] Successfully saved log:", result);

        setStocks((prevStocks) => {
          if (!prevStocks) return prevStocks;

          return prevStocks.map((stock) => {
            if (stock.name === targetName && stock.all > 0) {
              return { ...stock, all: stock.all - 1 };
            }
            return stock;
          });
        });
      } catch (error) {
        console.error(
          `[--ERROR--] Failed to decrease stock for ${targetName}:`,
          error,
        );
        alert(`在庫の更新に失敗しました: ${targetName}`);
      } finally {
        setIsProcessing((prev) => {
          const newSet = new Set(prev);
          newSet.delete(targetName);
          return newSet;
        });
        isUpdating.current--;

        console.log(
          `[--DEBUG--] Processing completed for ${targetName}. isUpdating: ${isUpdating.current}`,
        );

        await fetchData();
      }
    },
    [stocks, fetchData, isProcessing],
  );

  const isButtonDisabled = useCallback(
    (stockName: string, stockCount: number) => {
      return stockCount === 0 || isProcessing.has(stockName);
    },
    [isProcessing],
  );

  const toggleStockVisibility = useCallback((stockName: string) => {
    setVisibleStocks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stockName)) {
        newSet.delete(stockName);
      } else {
        newSet.add(stockName);
      }
      return newSet;
    });
  }, []);

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

          {viewStyle === "card" && (
            <div className="flex flex-wrap gap-4 mb-6">
              {stocks.map(({ name }) => (
                <label key={name} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={visibleStocks.has(name)}
                    onChange={() => toggleStockVisibility(name)}
                    className="w-6 aspect-square"
                  />
                  <span className="text-2xl">{name}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {viewStyle === "card" ? (
              stocks
                .filter(({ name }) => visibleStocks.has(name))
                .map(({ name, all }) => {
                  const isDisabled = isButtonDisabled(name, all);
                  const isCurrentlyProcessing = isProcessing.has(name);

                  return (
                    <div
                      key={name}
                      className="w-1/2 max-w-96 p-2 bg-white rounded-md shadow-md mb-4"
                    >
                      <h2 className="text-3xl pl-2 pb-2">{name}</h2>
                      <hr />
                      <div className="p-2">
                        <div className="flex flex-col gap-6">
                          <div className="flex gap-2 py-4 justify-center items-end">
                            <p className="text-5xl">{all}</p>
                            <p className="text-2xl">個</p>
                          </div>
                          <button
                            className={`w-full aspect-square rounded-full shadow-md text-3xl transition-all duration-300 cursor-pointer ${
                              isDisabled
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-(--accent-normal) hover:opacity-60"
                            }`}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => decreaseStock(name)}
                          >
                            {isCurrentlyProcessing ? "処理中..." : "一個売れた"}
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
                        className={`h-full px-4 py-1 flex flex-col justify-center cursor-pointer hover:opacity-100 transition-all duration-300 bg-(--base) rounded-t-md ${
                          tab === name ? "" : "opacity-60"
                        }`}
                        onKeyUp={() => {}}
                        onClick={() => setTab(name)}
                      >
                        <p className="text-2xl">{name}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full flex justify-center mt-12">
                  <div className="w-1/2 max-w-96 flex flex-col gap-6">
                    {(() => {
                      const currentStock = stocks
                        .filter(({ name }) => name === tab)
                        .at(0);
                      const stockCount = currentStock?.all || 0;
                      const isDisabled = isButtonDisabled(tab, stockCount);
                      const isCurrentlyProcessing = isProcessing.has(tab);

                      return (
                        <>
                          <div className="flex gap-2 py-4 justify-center items-end">
                            <p className="text-5xl">{stockCount}</p>
                            <p className="text-2xl">個</p>
                          </div>
                          <button
                            className={`w-full aspect-square rounded-full shadow-md text-3xl transition-all duration-300 cursor-pointer ${
                              isDisabled
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-(--accent-normal) hover:opacity-60"
                            }`}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => decreaseStock(tab)}
                          >
                            {isCurrentlyProcessing ? "処理中..." : "一個売れた"}
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
    </>
  );
}
