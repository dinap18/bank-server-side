const Transfer = require("../models/")("Transfer");
const {AuditLogBlockchain} = require("../services/AuditLogChainService")
const UserService = require("../services/UserService")
const Currency = require("../core/Currency")
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

            const to = await UserService.getUserById(data.to);

            const from = await UserService.getUserById(data.from);

            if (!to || !from || data.value < 0) {
                throw new Error("invalid transfer details");
            }

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
            to.accountBalance += data.value;
            from.accountBalance -= data.value;

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

    static async getTransfersToById(transferId) {
        try {
            return await Transfer.find({to: transferId});

        } catch (error) {
            console.log(`Transfer not found. ${error}`)
        }
    }

    static async getTransfersFromById(transferId) {
        try {
            return await Transfer.find({from: transferId});

        } catch (error) {
            console.log(`Transfer not found. ${error}`)
        }
    }
}