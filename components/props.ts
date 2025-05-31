export interface MutableDataPoint {
  time: Date | string;
  [key: string]: Date | number | string;
}

export interface DialogProps {
  dialog: {
    name: string;
    price: number;
    all: number;
  };
  show: boolean;
}

export type LineChartGraphProps = {
  data: MutableDataPoint[];
  goods: Array<string>;
};
