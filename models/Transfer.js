const mongoose = require('mongoose');
const debug = require("debug");


module.exports = db => {

    let schema = new mongoose.Schema({
        to: {type: String, required: true},
        from: {type: String, required: true},
        value: {type: Number, required: true},
        date: {type: Date, default: Date.now},
    })

    schema.statics.CREATE = function (data) {
        return this.create({
            "to": data.to,
            "from": data.from,
            "value": data.value,
        })
    }


    db.model('Transfer', schema);
    debug("Transfer model created");
}