export type GoodsType = StockType[];

export type BoughtType = {
  name: string;
  log: {
    time: Date;
    count: string;
  };
};

export type StockType = {
  name: string;
  price: number;
  all: number;
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
