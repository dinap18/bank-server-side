const mongoose = require('mongoose');
const debug = require("debug");


module.exports = db => {

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


    db.model('LevCoin', schema);
    debug("LevCoin model created");
}