const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const debug = require("debug");


module.exports = db => {
    let schema = new mongoose.Schema({
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        accountBalance: {type: Number, required: true},
        accountCurrency: {type: String, required: true},
        email: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        adminApproved: {type: Boolean, required: false},
        userType: {type: String, required: true, enum: ["admin", "user"]}
    })

    schema.statics.CREATE = function (data) {
        return this.create({
            "firstName": data.firstName,
            "lastName": data.lastName,
            "username": data.username,
            "password": data.password,
            "accountBalance": data.accountBalance,
            "accountCurrency": data.accountCurrency,
            "email": data.email,
            "phoneNumber": data.phoneNumber,
            "userType": data.userType,
            "adminApproved": true

        })
    }

    db.model('User', schema);


    debug("User model created");
}