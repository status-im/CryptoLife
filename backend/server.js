'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const bloomService = require('./services/bloom-service');
const LimePayService = require('./services/limepay-service');

var app = express();

app.use(bodyParser.json());

app.get('/api/payment', async (req, res, next) => {
    try {
        let token = await LimePayService.createPayment("5bd445a3474600056cb35e07", "chorap", "1", "1");
        res.json(token);
    } catch (error) {
        next(error);
    }
});

bloomService.start(app);

app.use((err, request, response, next) => {
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log("Marketplace app listening at http://localhost:" + 9090);
});