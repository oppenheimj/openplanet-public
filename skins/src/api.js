const objParser = require('./objParser');
const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('yo');
})

app.get('/cow', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.send(objParser.parseObjFile('cow'));
})

app.get('/cube', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.send(objParser.parseObjFile('cube'));
})

app.get('/ufo', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.send(objParser.parseObjFile('ufo'));
})
 
app.listen(8093)