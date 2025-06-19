require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const { getWeather } = require('./Weatherservice'); // fixed casing here

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Get all cities
app.get('/', (req, res) => {
  db.all('SELECT * FROM locations', (err, rows) => {
    res.render('index', { locations: rows });
  });
});

// Add a new city and fetch weather
app.post('/add', async (req, res) => {
  const city = req.body.city;
  const weather = await getWeather(city);
  if (weather) {
    db.run(
      'INSERT OR REPLACE INTO locations (name, temp, humidity) VALUES (?, ?, ?)',
      [weather.name, weather.temp, weather.humidity],
      () => res.redirect('/')
    );
  } else {
    res.send('Error: City not found or API failed.');
  }
});

// Delete a city
app.post('/delete/:id', (req, res) => {
  db.run('DELETE FROM locations WHERE id = ?', [req.params.id], () => {
    res.redirect('/');
  });
});

// Live weather API route for front-end updates
app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    const weather = await getWeather(city);
    if (weather) {
      res.json(weather);
    } else {
      res.status(500).send('Weather not found');
    }
  });
  

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌦️ Weatherly is running at http://localhost:${PORT}`);
});
