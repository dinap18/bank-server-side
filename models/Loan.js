const mongoose = require('mongoose');
const debug = require("debug");


module.exports = db => {

    let schema = new mongoose.Schema({
        to: {type: String, required: true},
        from: {type: String, required: true},
        value: {type: Number, required: true},
        date: {type: Date, default: Date.now},
        payedBack: {type: Number, default: 0},
        moneySent: {type: Boolean, default: false},
    })

    schema.statics.CREATE = function (data) {
        return this.create({
            "to": data.to,
            "from": data.from,
            "value": data.value,
            "date": data.date || Date.now(),
            "moneySent": data.moneySent || true,
        })
    }


    db.model('Loan', schema);
    debug("Loan model created");
}