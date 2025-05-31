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
import { colorSchameGenerator } from "@/lib/chrome/color-schame-generator";

export default function BarChartGraph({ data, goods }: LineChartGraphProps) {
  const graphData = [];
  for (const good of goods) {
    console.log(`[--DEBUG--] good is ${good}`);
    const good_info: { [key: string]: number } = {};
    good_info[good] = 0;

    for (const info of data) {
      console.log(`[--DEBUG--] info is ${JSON.stringify(info)}`);
      if (info[good]) good_info[good] += info[good] as number;
    }
    good_info.count = good_info[good];
    graphData.push(good_info);
  }

  console.log(`[--DEBUG--] graphData is\n${JSON.stringify(graphData)}`);

  let width = 800;
  if (typeof window !== "undefined" && window.screen.width < width)
    width = window.screen.width - 72;

  return (
    <BarChart
      width={width}
      height={width / 2}
      data={graphData}
      margin={{
        top: 5,
        right: 20,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid stroke={Colors.font} strokeDasharray="1 1" />
      <Tooltip />
      <YAxis dataKey={"count"} />
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
      {goods.map((good, index) => {
        const colors = colorSchameGenerator(
          Colors["accent-normal"],
          Colors["accent-warn"],
          goods.length,
        );

        return <Bar dataKey={good} fill={colors[index]} key={good} />;
      })}
    </BarChart>
  );
}
