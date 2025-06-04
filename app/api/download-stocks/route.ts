import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { get } from "@/lib/mongo-db/get";
import type { boughtLogsType, GoodsType } from "@/lib/types";

export async function GET() {
  try {
    const boughtData = await get({ type: "bought" });
    const goodsData = await get({ type: "goods" });
    const boughtLogs: boughtLogsType = boughtData.logs;
    const goods: GoodsType = goodsData.goods;

    for (const stock of goods) {
      let soldCount = 0;
      for (const log of boughtLogs) {
        soldCount += log.counts[stock.name] ?? 0;
      }
      stock.sold = soldCount;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("データ");

    // make header
    worksheet.columns = [
      { header: "商品名", key: "name", width: 20 },
      { header: "価格", key: "price", width: 15 },
      { header: "個数", key: "all", width: 15 },
      { header: "売上個数", key: "sold", width: 15 },
      { header: "売上率", key: "salesRate", width: 15 },
      { header: "売上金額", key: "salesAmount", width: 15 },
    ];

    goods.forEach((stock, index) => {
      const rowIndex = index + 2; // header is 1
      worksheet.addRow({
        name: stock.name,
        price: stock.price,
        all: stock.all,
        sold: stock.sold,
        salesRate: { formula: `D${rowIndex}/(C${rowIndex}+D${rowIndex})` },
        salesAmount: { formula: `B${rowIndex}*D${rowIndex}` },
      });
    });

    /* Staying */
    // header
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2383e2" },
    };
    // stock name
    worksheet.getColumn("name").font = { bold: true };
    worksheet.getColumn("salesRate").numFmt = "0.00%";

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=stocks_data.xlsx",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to generate Excel file: ${error}`,
      },
      { status: 500 },
    );
  }
}
