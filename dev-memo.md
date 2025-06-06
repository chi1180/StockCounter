# 2025-06-06

## Logic of counter page 🚀

---

### Startup

1. Get stocks data from Mongo DB & set to StocksData state
2. Show cards of stocks

---

### Stock cards view

1. Clicked view change button
2. IF [ Card ] -> [ Tab ]

   - Change StockViewStyle state to "tab"

3. ELSE

   - change to "card"

---

### Visible stock cards selector

1. On changed checkbox

   - Set selectedStocks state (type is Set)

---

### On clicked "sold one" button

1. Add stock's name to processingStocks state (It needs not as a type of Set because button will disabled after onclicked)

---

### DB loader

1. Fetch data
1. IF processingStocks state includes some stock name
   1. Skepp it
1. ELSE
   1. Updata stock data to StocksData

- Fetch reguraly per 1 sec

---

---

## Set values 💻️

| **商品名**       | **価格** | **個数** |
| ---------------- | -------: | -------: |
| 唐揚げ           |      100 |      120 |
| フライドポテト   |      100 |      100 |
| 揚げたこ焼き     |      100 |       60 |
| アイス（ミルク） |      200 |       50 |
| アイス（チョコ） |      200 |       25 |
| アイス（イチゴ） |      200 |       25 |
| ソフトドリンク   |      100 |      216 |
| うどん           |      300 |      100 |
| 焼きそば         |      300 |      120 |
