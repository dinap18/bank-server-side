const mongoose = require('mongoose');
const debug = require("debug");


module.exports = db => {

    let schema = new mongoose.Schema({
        from: String,
        to: String,
        text: String,
        isRead: Boolean,
    }, {timestamps: true});

    schema.statics.CREATE = function (data) {
        return this.create({
            "to": data.to,
            "from": data.from,
            "text": data.value,
            "isRead": data.isRead,
        })
    }


    db.model('Message', schema);
    debug("Message model created");
}