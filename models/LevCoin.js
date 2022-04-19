const mongoose = require('mongoose');
const debug = require("debug");


module.exports = db => {
    // create a schema
    let schema = new mongoose.Schema({
        user: {type: String, required: true},
        value: {type: Number, required: true}
    })

    schema.statics.CREATE = function (data) {
        return this.create({
            "user": data.user,
            "value": data.value,
        })
    }

    // the schema is useless so far
    // we need to create a model using it
    db.model('LevCoin', schema); // if model name === collection name
    debug("LevCoin model created");
}