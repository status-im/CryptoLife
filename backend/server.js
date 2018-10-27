'use strict';
const express = require('express');

const bodyParser = require('body-parser');
var cors = require('cors')

const bloomService = require('./services/bloom-service');

var app = express();

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }))

let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/payment', async (req, res, next) => {
    res.json("success");
});

bloomService.start(app, io);

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

http.listen(9090, () => {
    console.log("Marketplace app listening at http://localhost:" + 9090);
});