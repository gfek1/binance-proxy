import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// Binance Proxy
app.get("/binance", async (req, res) => {
  const { path = "", ...query } = req.query;
  if (!path) return res.status(400).json({ error: "Missing 'path' query parameter." });

  let baseURL = "https://api.binance.com"; // Spot
  if (path.startsWith("fapi/")) baseURL = "https://fapi.binance.com"; // USDT-M Futures
  else if (path.startsWith("dapi/")) baseURL = "https://dapi.binance.com"; // COIN-M Futures

  const url = new URL(`${baseURL}/${path}`);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Binance proxy failed", message: err.message });
  }
});

// MEXC Proxy
app.get("/mexc", async (req, res) => {
  const { path = "", ...query } = req.query;
  if (!path) return res.status(400).json({ error: "Missing 'path' query parameter." });

  let baseURL = "https://api.mexc.com"; // Spot
  if (path.startsWith("contract/")) baseURL = "https://contract.mexc.com"; // Futures

  const url = new URL(`${baseURL}/${path}`);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "MEXC proxy failed", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
