const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DB_FILE = path.join(__dirname, "db.json");

// Body als JSON parsen
app.use(express.json({ limit: "2mb" }));

// Hilfsfunktionen für DB lesen/schreiben
function loadDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    return {};
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// Statische Dateien aus dem public-Ordner ausliefern
app.use(express.static(path.join(__dirname, "public")));

// API: gesamten „Storage“ holen
app.get("/api/storage", (req, res) => {
  const data = loadDB();
  res.json(data);
});

// API: gesamten „Storage“ speichern
app.post("/api/storage", (req, res) => {
  const body = req.body || {};
  saveDB(body);
  res.json({ ok: true });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Dienstplan-Server läuft auf http://localhost:${PORT}`);
});