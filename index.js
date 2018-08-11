const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
const apiKey = 'xxx';

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .use(bodyParser.urlencoded({ extended: true }))
  .set('view engine', 'ejs')
  .get('/', (req, res) =>
    res.render('pages/index', { weather: null, error: null })
  )
  .post('/', function(req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    request(url, function(err, response, body) {
      if (err) {
        res.render('pages/index', {
          weather: null,
          error: 'Error, please try again'
        });
      } else {
        let weather = JSON.parse(body);
        if (weather.main == undefined) {
          res.render('pages/index', {
            weather: null,
            error: 'Error, please try again'
          });
        } else {
          let weatherText = `It's ${weather.main.temp} degrees in ${
            weather.name
          }!`;
          res.render('pages/index', { weather: weatherText, error: null });
        }
      }
    });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
