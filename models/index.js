const debug = require("debug")("bank-app:model");
const mongo = require("mongoose");

let db = mongo.createConnection();
let URI = "mongodb+srv://project:project@bank-app.d3vg0.mongodb.net/bank-app?retryWrites=true&w=majority";

(async () => {
    try {
        await db.openUri(URI, {useNewUrlParser: true, useUnifiedTopology: true});
    } catch (err) {
        debug("Error connecting to DB: " + err);
    }
})();
debug('Pending DB connection');

require("./User")(db);
require("./LevCoin")(db);
require("./Loan")(db);
require("./Transfer")(db);

module.exports = model => db.model(model);