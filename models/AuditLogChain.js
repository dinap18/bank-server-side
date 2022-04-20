const mongoose = require('mongoose');
const debug = require("debug");

// define the AuditLogChain model for data storage
module.exports = db => {
    // create a schema
    let schema = new mongoose.Schema({
        data: {type: mongoose.Schema.Types.Mixed},
        preceding_hash: {type: mongoose.Schema.Types.String},
        hash: {type: mongoose.Schema.Types.String},
        iterations: {type: mongoose.Schema.Types.Number},
        created_on: {type: Number}
    }, {
        collection: 'audit_log_chain',
        toObject: {virtuals: true},
        toJSON: {virtuals: true}
    });
    schema.virtual('id').get(function () {
        return String(this._id);
    });
    db.model('AuditLogChain', schema); // if model name === collection name
    debug("Blockchain model created");
}