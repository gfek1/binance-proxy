export default async function handler(req, res) {
  const { path = '', ...query } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing 'path' query parameter." });
  }

  const url = new URL(`https://api.binance.com/${path}`);
  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  try {
    const binanceRes = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const data = await binanceRes.json();
    res.status(binanceRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", message: err.message });
  }
}
