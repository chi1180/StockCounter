import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Rectangle,
} from "recharts";
import type { LineChartGraphProps } from "./props";
import { Colors } from "./colors";

export default function BarChartGraph({ data, goods }: LineChartGraphProps) {
  const graphData = [{}];
  for (const good of goods) {
    graphData[good] = 0;
    for (const info of data) {
      if (info[good]) graphData[good] += info[good] as number;
    }
  }

  console.log(`[--DEBUG--] graphData is\n${JSON.stringify(graphData)}`);

  let width = 800;
  if (typeof window !== "undefined" && window.screen.width < width)
    width = window.screen.width;

  return (
    <ResponsiveContainer width={width} height={width / 2}>
      <BarChart
        width={500}
        height={300}
        data={graphData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* <XAxis dataKey="name" /> */}
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.entries(graphData.at(0)).map(([key, value]) => {
          return (
            <Bar
              dataKey={key}
              fill={Colors["accent-normal"]}
              key={key.concat(value.toString())}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
