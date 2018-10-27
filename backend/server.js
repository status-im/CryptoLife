'use strict';
const express = require('express');

const app = express();

app.get('/payment', async (req, res, next) => {
    res.json("success");
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log("Marketplace app listening at http://localhost:" + 9090);
});