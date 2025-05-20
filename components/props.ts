export interface MutableDataPoint {
  time: Date | string;
  [key: string]: Date | number | string;
}

export type LineChartGraphProps = {
  data: MutableDataPoint[];
  goods: Array<string>;
};
