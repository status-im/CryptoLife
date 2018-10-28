let mongoose = require("mongoose");
let DB_CONNECTION = "mongodb://limepaytest1:cc8-YBc-KEJ-GCR@ds143593.mlab.com:43593/detsy";

class DBConfig {

    static config() {
        mongoose.Promise = global.Promise;
        mongoose.connect(DB_CONNECTION, { useNewUrlParser: true });
    }
}

module.exports = DBConfig;
