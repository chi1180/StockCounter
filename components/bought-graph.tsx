"use client";

import LineChartGraph from "./LineChartGraph";
import { useEffect, useState } from "react";
import BarChartGraph from "./BarChartGraph";
import type { MutableDataPoint } from "./props";
import Loading from "./loading";

// Update DataTuple to use array of BoughtType
type DataTuple = [MutableDataPoint[], Array<string>];

export default function BoughtGraph() {
  const [data, setData] = useState<DataTuple | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const apiResponse = await fetch("/api/database?for=bought-graph");
      const result = await apiResponse.json();
      if (apiResponse.status === 200) {
        setData([result.graphData, result.good_names]);
      } else {
        console.log(
          `[--ERROR--] Erroed in bought-graph fetchData\n${result.error}`,
        );
      }
    };

    fetchData();

    if (process.env.NODE_ENV !== "development") {
      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  if (!data) {
    return <Loading />;
  }

  const [boughtData, goods] = data;

  return (
    <>
      <div className="flex items-center gap-2 py-12">
        <div className="h-14 w-1.5 bg-(--accent-normal)" />
        <h2 className="text-4xl">売上推移</h2>
      </div>
      <div className="bg-(--light) p-12 pb-0 rounded-lg">
        <LineChartGraph data={boughtData} goods={goods} />
      </div>
      {/* sep */}
      <div className="flex items-center gap-2 py-12">
        <div className="h-14 w-1.5 bg-(--accent-normal)" />
        <h2 className="text-4xl">売上合計</h2>
      </div>
      <div className="bg-(--light) p-12 pb-0 rounded-lg">
        <BarChartGraph data={boughtData} goods={goods} />
      </div>
    </>
  );
}
