"use client";

import type { BoughtType, GoodsType } from "@/lib/types";
import LineChartGraph from "./LineChartGraph";
import { useEffect, useState } from "react";
import BarChartGraph from "./BarChartGraph";

export default function BoughtGraph() {
  const [data, setData] = useState<[BoughtType, GoodsType]>();

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

    const interval = setInterval(fetchData, 1000 * 3);
    return () => clearInterval(interval);
  }, []);

  if (data) {
    if (data.at(0) && data.at(1))
      return (
        <div className="w-fit h-fit bg-(--light) p-12 rounded-lg">
          <LineChartGraph data={data.at(0)} goods={data.at(1)} />
          <BarChartGraph data={data.at(0)} goods={data.at(1)} />
        </div>
      );
  }

  return <></>;
}
