let mongoose = require("mongoose");
let Schema = mongoose.Schema;
const SHOPPER_NAME = 'Shopper';

let ShopperSchema = new Schema({
    id: Number, // (Get from BlueSnap)
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    walletAddress: {
        type: String
    }
});

module.exports = mongoose.model(SHOPPER_NAME, ShopperSchema);
