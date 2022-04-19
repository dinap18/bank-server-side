const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const debug = require("debug");


module.exports = db => {
    // create a schema
    let schema = new mongoose.Schema({
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        accountBalance: {type: Number, required: true},
        email: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        userType: {type: String, required: true, enum: ["admin", "user"]}
    })
    schema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

// checking if password is valid
    schema.methods.validPassword = function (password) {
        return bcrypt.compareSync(password, this.local.password);
    };

    schema.statics.CREATE = function (data) {
        return this.create({
            "firstName": data.firstName,
            "lastName": data.lastName,
            "username": data.username,
            "password": data.password,
            "accountBalance": data.accountBalance,
            "email": data.email,
            "phoneNumber": data.phoneNumber,
            "userType": data.userType
        })
    }

    // the schema is useless so far
    // we need to create a model using it
    db.model('User', schema); // if model name === collection name
    debug("User model created");
}