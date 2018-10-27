'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const bloomService = require('./services/bloom-service');
const LimePayService = require('./services/limepay-service');

var app = express();

app.use(bodyParser.json());

app.get('/api/payment', async (req, res, next) => {
    try {
        let shopper = await LimePayService.createShopper("George", "Spasov", "test@test.com", "0x78ef4f3e6a88ca21ac0524a44570cf141a165094");
        let token = await LimePayService.createPayment(shopper._id, "chorap", "1", "1");
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