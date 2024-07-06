// import fs from 'node:fs/promises';

const fs = require('node:fs/promises');

// import ServerlessHttp from 'serverless-http';
// import bodyParser from 'body-parser';
// import express from 'express';
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const router = express.Router();

app.use(express.static('images'));
app.use(bodyParser.json());

//CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

// router.get('/', ( req, res ) => {
//   res.send('App is running..');
// });

router.get('/places', async (req, res) => {
  const fileContent = await fs.readFile('./data/places.json');

  const placesData = JSON.parse(fileContent);

  res.status(200).json({ places: placesData });
});

router.get('/user-places', async (req, res) => {
  const fileContent = await fs.readFile('./data/user-places.json');

  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});

router.put('/user-places', async (req, res) => {
  const places = req.body.places;

  await fs.writeFile('./data/user-places.json', JSON.stringify(places));

  res.status(200).json({ message: 'User places updated!' });
});

// 404
router.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

// app.listen(3000);
