let mongoose = require("mongoose");
let DB_CONNECTION = "mongodb://localhost:27017/detsy";

class DBConfig {

    static config() {
        mongoose.Promise = global.Promise;
        mongoose.connect(DB_CONNECTION, { useNewUrlParser: true });
    }
}

module.exports = DBConfig;
