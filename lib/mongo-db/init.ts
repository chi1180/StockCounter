const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USER || "")}:${encodeURIComponent(process.env.DB_PASSWORD || "")}@stocks.q8sgkmk.mongodb.net/?retryWrites=true&w=majority&appName=stocks`;

export { uri };
