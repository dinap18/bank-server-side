const Transfer = require("../models/")("Transfer");
const {AuditLogBlockchain} = require("../services/AuditLogChainService")
const UserService = require("../services/UserService")
const Currency = require("../core/Currency")
const _ = require("lodash");
module.exports = class TransferService {
    static async getAllTransfers() {
        try {
            return await Transfer.find();

        } catch (error) {
            throw new Error(`Could not fetch bank transfers ${error}`)
        }
    }

    static async createTransfer(data) {
        try {

            const to = await UserService.getUserByUsername(data.to);

            const from = await UserService.getUserByUsername(data.from);

            if (!to || !from || data.value < 0) {
                throw new Error("invalid transfer details");
            }
            let oldValue = data.value;

            if (to.accountCurrency !== from.accountCurrency) {
                data.value = await Currency.convertCurrency(from.accountCurrency, to.accountCurrency, data.value)
            }

            let blockChain = new AuditLogBlockchain();
            await blockChain.initialize();

            await blockChain.createTransaction(data);

            let status = await blockChain.checkChainValidity();

            if (!status) {
                throw new Error("error validating transfer");
            }


            to.accountBalance += parseInt(to.accountBalance) + parseInt(oldValue);
            from.accountBalance = parseInt(from.accountBalance) - parseInt(data.value);


            await UserService.updateUser(to, data.to);
            await UserService.updateUser(from, data.from);

            return await Transfer.create(data);

        } catch (error) {
            throw new Error(error);
        }

    }

    static async getTransferById(transferId) {
        try {
            return await Transfer.findById({_id: transferId});

        } catch (error) {
            throw new Error(`Transfer not found. ${error}`)
        }
    }

    static async getTransfersToById(transferId) {
        try {
            return await Transfer.find({to: transferId})

        } catch (error) {
            throw new Error(`Transfer not found. ${error}`)
        }
    }

    static async getTransfersFromById(transferId) {
        try {
            return await Transfer.find({from: transferId})

        } catch (error) {
            throw new Error(`Transfer not found. ${error}`)
        }
    }
}