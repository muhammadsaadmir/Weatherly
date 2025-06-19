const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./weather.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    temp REAL,
    humidity INTEGER
  )
`);

module.exports = db;
