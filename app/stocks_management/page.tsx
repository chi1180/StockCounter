"use client";

import Header from "@/components/header";
import Loading from "@/components/loading";
import type { GoodsType, StockType } from "@/lib/types";
import { useEffect, useState } from "react";

export default function StocksManaagement() {
  let width = 800;
  if (typeof window !== "undefined" && window.screen.width < width)
    width = window.screen.width - 72;

  const [data, setData] = useState<GoodsType>();

  useEffect(() => {
    const fetchData = async () => {
      const apiResponse = await fetch("/api/database?for=stocks-view");
      const result = await apiResponse.json();
      if (apiResponse.status === 200) {
        if (result.stocks) setData(result.stocks.goods);
      } else {
        console.log(
          `[--ERROR--] Erroed in stocks-view fetchData\n${result.error}`,
        );
      }
    };

    fetchData();

    if (process.env.NODE_ENV !== "development") {
      const interval = setInterval(fetchData, 1000 * 3);
      return () => clearInterval(interval);
    }
  }, []);

  const initialDialog = {
    name: "",
    price: 0,
    all: 0,
  };
  const [dialog, setDialog] = useState(initialDialog);

  const [formData, setFormData] = useState(initialDialog);

  useEffect(() => {
    setFormData(dialog);
  }, [dialog]);

  if (data) {
    return (
      <div
        className={`w-screen ${dialog.name ? "h-screen overflow-hidden" : "h-full"}`}
      >
        <Header />

        <main className="p-6">
          <div className="flex items-center gap-2 py-12">
            <div className="h-14 w-1.5 bg-(--accent-normal)" />
            <h2 className="text-4xl">商品の登録</h2>
          </div>
          <div className="bg-(--light) p-12 rounded-lg">
            <div className="w-full max-w-[800] aspect-video">
              <p className="text-2xl pl-2">商品名</p>
              <input
                type="text"
                autoComplete="false"
                placeholder={"ここに商品名を入力してください"}
                className="py-1 px-2 h-16 text-2xl rounded-md my-2 border-2 border-(--base) w-full focus:outline-none"
                id="new_stock_input_name"
              />

              <div className="h-4" />

              <div className="flex gap-4">
                <div>
                  <p className="text-2xl pl-2">価格</p>
                  <input
                    type="number"
                    min={0}
                    className="py-1 px-2 h-16 text-2xl rounded-md my-2 border-2 border-(--base) w-full focus:outline-none"
                    id="new_stock_input_price"
                  />
                </div>

                <div>
                  <p className="text-2xl pl-2">個数</p>
                  <input
                    type="number"
                    min={0}
                    className="py-1 px-2 h-16 text-2xl rounded-md my-2 border-2 border-(--base) w-full focus:outline-none"
                    id="new_stock_input_all"
                  />
                </div>
              </div>

              <div className="pt-16 flex gap-4 justify-end *:w-30 *:h-16 *:rounded-md *:text-xl *:font-medium">
                <button
                  type="button"
                  className="bg-(--accent-normal) text-white transition-all duration-300 hover:opacity-60"
                  onClick={() => {
                    const goods: Array<string> = [];
                    for (const stock of data) {
                      goods.push(stock.name);
                    }
                    newStockClickHandler(goods, "new");
                  }}
                >
                  登録
                </button>
              </div>
            </div>
          </div>

          {/* Existing sotkcs */}

          <div className="flex items-center gap-2 py-12">
            <div className="h-14 w-1.5 bg-(--accent-normal)" />
            <h2 className="text-4xl">登録済みの商品</h2>
          </div>
          <div className="bg-(--light) p-12 rounded-lg">
            <table className="w-full max-w-[800]">
              <thead className="bg-(--accent-sub) px-4 py-2">
                <tr className="*:text-xl *:py-2 px-3">
                  <th>商品名</th>
                  <th>価格</th>
                  <th>個数</th>
                </tr>
              </thead>

              <tbody>
                {data.map((stock) => {
                  return (
                    <tr
                      key={stock.name}
                      className="*:py-2 *:px-3 border-b-(--accent-sub) border-b-2 nth-of-type-[even]:bg-(--base) last-of-type:border-b-4 text-xl hover:!bg-(--accent-normal) hover:opacity-60 cursor-pointer transition-all duration-300"
                      onClick={() => {
                        setDialog(stock);
                      }}
                      onKeyUp={() => {}}
                    >
                      <td>{stock.name}</td>
                      <td className="text-end text-xl">{stock.price}</td>
                      <td className="text-end text-xl">{stock.all}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>

        {/* sep */}

        <div
          className={`w-screen h-screen top-0 absolute ${dialog.name ? "block" : "hidden"} transition-all duration-300`}
        >
          <div className="w-full h-full relative">
            <div className="w-full h-full opacity-60 bg-black absolute top-0" />
            <div className="w-full max-w-[800] aspect-video opacity-100 *:opacity-100 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg">
              <h1 className="text-4xl text-center pb-12">登録済み商品の変更</h1>
              <p className="text-2xl pl-2">商品名</p>
              <input
                type="text"
                id="exist_stock_input_name"
                value={formData.name}
                readOnly={true}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                autoComplete="false"
                placeholder={"ここに商品名を入力してください"}
                className="py-1 px-2 h-16 text-2xl rounded-md my-2 border-2 border-(--base) w-full focus:outline-none"
              />

              <div className="h-4" />

              <div className="flex gap-4">
                <div>
                  <p className="text-2xl pl-2">価格</p>
                  <input
                    type="number"
                    id="exist_stock_input_price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    min={0}
                    className="py-1 px-2 h-16 text-2xl rounded-md my-2 border-2 border-(--base) w-full focus:outline-none"
                  />
                </div>

                <div>
                  <p className="text-2xl pl-2">個数</p>
                  <input
                    type="number"
                    id="exist_stock_input_all"
                    value={formData.all}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        all: Number(e.target.value),
                      })
                    }
                    min={0}
                    className="py-1 px-2 h-16 text-2xl rounded-md my-2 border-2 border-(--base) w-full focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-16 flex gap-4 justify-end *:w-30 *:h-16 *:rounded-md *:text-xl *:font-medium">
                <button
                  type="button"
                  className="bg-(--accent-normal) text-white transition-all duration-300 hover:opacity-60"
                  onClick={() => {
                    console.log("保存データ:", formData);
                    const goods: Array<string> = [];
                    for (const stock of data) {
                      goods.push(stock.name);
                    }
                    newStockClickHandler(goods, "exist");
                    setDialog(initialDialog);
                    setFormData(initialDialog);
                  }}
                >
                  保存
                </button>
                <button
                  type="button"
                  className="bg-(--base) transition-all duration-300 hover:opacity-60"
                  onClick={() => {
                    setDialog(initialDialog);
                    setFormData(initialDialog);
                  }}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="bg-(--accent-warn) text-white transition-all duration-300 hover:opacity-100 opacity-60"
                  onClick={() => {
                    const isCertain = confirm(
                      `登録済みの商品「${formData.name}」を削除しますか？`,
                    );
                    if (isCertain) {
                      console.log("削除データ:", formData);
                      deleteStock(formData);
                      setDialog(initialDialog);
                      setFormData(initialDialog);
                    }
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Loading />
    </>
  );
}

async function newStockClickHandler(
  goods: Array<string>,
  src: "exist" | "new",
) {
  const name = document.getElementById(
    `${src}_stock_input_name`,
  ) as HTMLInputElement;
  const price = document.getElementById(
    `${src}_stock_input_price`,
  ) as HTMLInputElement;
  const all = document.getElementById(
    `${src}_stock_input_all`,
  ) as HTMLInputElement;

  if (name.value.trim() === "") {
    alert("商品名を入力してください。");
  } else if (!/^\d+$/.test(price.value)) {
    alert("価格には半角数字のみを入力してください。");
  } else if (!/^\d+$/.test(all.value)) {
    alert("個数には半角数字のみを入力してください");
  } else if (goods.includes(name.value) && src !== "exist") {
    alert(`そちらの商品名は既に登録されています。\n商品名：${name.value}`);
  } else {
    const stockInfo: StockType = {
      name: name.value,
      price: Number.parseInt(price.value),
      all: Number.parseInt(all.value),
    };

    const response = await fetch("/api/database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "goods",
        data: {
          is_exist: src === "exist",
          data: stockInfo,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    alert(
      `商品の登録が完了しました！😆🎉\n\n【登録内容】\n商品名：${stockInfo.name}\n価格：${stockInfo.price}\n個数：${stockInfo.all}`,
    );
    const result = await response.json();
    console.log("Success to save stock data:", result);

    name.value = "";
    price.value = "";
    all.value = "";
  }
}

async function deleteStock(stock: StockType) {
  const response = await fetch("/api/database", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "goods",
      data: {
        is_delete: true,
        data: stock,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  alert(
    `商品の削除が完了しました！😆🎉\n\n【削除した商品】\n商品名：${stock.name}\n価格：${stock.price}\n個数：${stock.all}`,
  );
  const result = await response.json();
  console.log("Success to save stock data:", result);
}
