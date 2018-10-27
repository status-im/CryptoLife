'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const bloomService = require('./services/bloom-service');

var app = express();

app.use(bodyParser.json());

app.get('/payment', async (req, res, next) => {
    res.json("success");
});

bloomService.start(app);

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log("Marketplace app listening at http://localhost:" + 9090);
});