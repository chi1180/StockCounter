const uri = `mongodb+srv://${encodeURIComponent(process.env.DB_USER || "")}:${encodeURIComponent(process.env.DB_PASSWORD || "")}@stocks.q8sgkmk.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true&authSource=admin&appName=stocks`;

export { uri };
