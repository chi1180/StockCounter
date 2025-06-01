"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { LineChartGraphProps } from "./props";
import { Colors } from "./colors";
import { colorSchameGenerator } from "@/lib/chrome/color-schame-generator";

export default function LineChartGraph({ data, goods }: LineChartGraphProps) {
  for (const info of data) {
    info.time = new Date(info.time).toLocaleString();
  }

  return (
    <div className="w-full max-h-[600] aspect-video">
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          {goods.map((good, index) => {
            const colors = colorSchameGenerator(
              Colors["accent-normal"],
              Colors["accent-warn"],
              goods.length,
            );
            return (
              <Line
                key={good}
                type="monotone"
                dataKey={good}
                strokeWidth={2}
                stroke={colors.at(index)}
              />
            );
          })}
          <CartesianGrid stroke={Colors.font} strokeDasharray="1 1" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend
            width={100}
            wrapperStyle={{
              top: -10,
              right: 0,
              paddingBlock: "10px",
              backgroundColor: "white",
              border: "1px solid #d5d5d",
              borderRadius: 6,
              lineHeight: "30px",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
