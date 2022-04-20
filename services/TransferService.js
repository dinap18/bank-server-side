const Transfer = require("../models/")("Transfer");
const ObjectId = require('mongodb').ObjectId;
const {AuditLogBlockchain} = require("../services/AuditLogChainService")
const UserService = require("../services/UserService")

module.exports = class TransferService {
    static async getAllTransfers() {
        try {
            return await Transfer.find();

        } catch (error) {
            console.log(`Could not fetch bank transfers ${error}`)
        }
    }

    static async createTransfer(data) {
        try {


            let to = null;
            await UserService.getUserById(data.to).then(result =>{ to = result;console.log(result)});

            let from = null;
            await UserService.getUserById(data.from).then(result => from = result);

            if (!to || !from || data.value < 0) {
                throw new Error("invalid transfer details");
            }
            let blockChain = new AuditLogBlockchain();
            await blockChain.initialize();

            await blockChain.createTransaction(data);

            let status = await blockChain.checkChainValidity();

            if (!status) {
                throw new Error("error validating transfer");
            }
            to.accountBalance -= data.value;
            from.accountBalance += data.value;

            await UserService.updateUser(to, data.to);
            await UserService.updateUser(from, data.from);
            return await Transfer.create(data);

        } catch (error) {
            console.log(error);
        }

    }

    static async getTransferById(transferId) {
        try {
            return await Transfer.findById({_id: transferId});

        } catch (error) {
            console.log(`Transfer not found. ${error}`)
        }
    }
}