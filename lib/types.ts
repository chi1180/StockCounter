export type GoodsType = {
  name: string;
  price: number;
  all: number;
}[];

export type BoughtType = {
  name: string;
  log: {
    time: Date;
    count: string;
  };
};
