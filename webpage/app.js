require('dotenv').config();

const express = require('express');
var favicon = require('serve-favicon')
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

app.use(favicon(path.join(__dirname, 'favicon.ico')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get("/build/*", function(req, res) {
  res.sendFile(path.join(__dirname + req.originalUrl));
});

// app.get('/favicon.ico', (req, res) => res.status(204));

app.listen(port, () => console.log('Server started at http://localhost:' + port));

