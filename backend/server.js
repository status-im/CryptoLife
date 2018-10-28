'use strict';
const express = require('express');

require('./config/mongo').config();

const bodyParser = require('body-parser');
var cors = require('cors')

const bloomService = require('./services/bloom-service');
const LimePayService = require('./services/limepay-service');
const Shopper = require('./models/shopper');

var app = express();

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }))

let http = require('http').Server(app);
let io = require('socket.io')(http);

/**
 *  {shopperId, walletAddress, itemName, price} 
 */
app.post('/api/payment', async (req, res, next) => {
    try {
        let bodyData = req.body;
        let shopperData = await Shopper.findById(bodyData.shopperId);

        // Hack for same emails
        let shopperEmail = (new Date().getTime()) + shopperData.email;
        let limePayShopper = await LimePayService.createShopper(shopperData.firstName, shopperData.lastName, shopperEmail, req.body.walletAddress);

        let token = await LimePayService.createPayment(limePayShopper._id, bodyData.itemName, bodyData.price, bodyData.tokenPrice);
        res.json(token);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

bloomService.start(app, io);

app.use((err, request, response, next) => {
    response.status(500).send("Something went wrong.");
});

http.listen(9090, () => {
    console.log("Marketplace app listening at http://localhost:" + 9090);
});