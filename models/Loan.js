const mongoose = require('mongoose');
const debug = require("debug");


module.exports = db => {
    // create a schema
    let schema = new mongoose.Schema({
        to: {type: String, required: true},
        from: {type: String, required: true},
        value: {type: Number, required: true}
    })

    schema.statics.CREATE = function (data) {
        return this.create({
            "to": data.to,
            "from": data.from,
            "value": data.value,
        })
    }

    // the schema is useless so far
    // we need to create a model using it
    db.model('Loan', schema); // if model name === collection name
    debug("Loan model created");
}