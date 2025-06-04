export type GoodsType = StockType[];

export type StockType = {
  name: string;
  price: number;
  all: number;
  sold?: number;
};

export type GoodsInfoType = {
  type: "goods";
  goods: GoodsType;
};

export type boughtLogsType = LogType[];

export type LogType = {
  time: Date;
  counts: {
    [key: string]: number;
  };
};
