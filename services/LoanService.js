const UserService = require("../services/UserService");
const Currency = require("../core/Currency");
const {AuditLogBlockchain} = require("../services/AuditLogChainService");
const {ObjectId} = require("mongodb");
const Loan = require("../models/")("Loan");

module.exports = class LoanService {
    static async getAllLoans() {
        try {
            return await Loan.find();
        } catch (error) {
            console.log(`Could not fetch loans ${error}`)
        }
    }

    static async createLoan(data) {
        try {
            const to = await UserService.getUserById(data.to);

            const from = await UserService.getUserById(data.from);

            if (!to || !from || data.value < 0) {
                throw new Error("invalid loan details");
            }

            if (!(data.date && new Date(data.date) > new Date(Date.now()))) {

                if (to.accountCurrency !== from.accountCurrency) {
                    data.value = await Currency.convertCurrency(from.accountCurrency, to.accountCurrency, data.value)
                }

                if (from.accountBalance / 2 < data.value) {
                    throw new Error("user does not have enough money to lend");
                }
                if (to.accountBalance * 0.6 < data.value) {
                    throw new Error("user is requesting too much money");
                }


                let blockChain = new AuditLogBlockchain();
                await blockChain.initialize();

                await blockChain.createTransaction(data);

                let status = await blockChain.checkChainValidity();

                if (!status) {
                    throw new Error("error validating loan");
                }
                to.accountBalance += data.value;
                from.accountBalance -= data.value;

                data.moneySent = true;

                await UserService.updateUser(to, data.to);
                await UserService.updateUser(from, data.from);
            }
            return await Loan.create(data);

        } catch (error) {
            console.log(error);
        }

    }

    static async updateLoan(updatedLoan, id) {
        try {
            const query = {_id: new ObjectId(id)}
            return await Loan.updateOne(
                query, updatedLoan
            );
        } catch (error) {
            console.log(`Could not update Loan ${error}`);

        }
    }

    static async transferLoan(data) {
        try {
            const to = await UserService.getUserById(data.to);

            const from = await UserService.getUserById(data.from);

            let blockChain = new AuditLogBlockchain();
            await blockChain.initialize();

            await blockChain.createTransaction(data);

            let status = await blockChain.checkChainValidity();

            if (!status) {
                throw new Error("error validating loan");
            }
            to.accountBalance += data.value;
            from.accountBalance -= data.value;

            data.moneySent = true;

            await this.updateLoan(data, data._id);

            await UserService.updateUser(to, data.to);
            await UserService.updateUser(from, data.from);


        } catch (error) {
            console.log(error);
        }

    }

    static async getLoanById(loanId) {
        try {
            return await Loan.findById({_id: loanId});
        } catch (error) {
            console.log(`Loan not found. ${error}`)
        }
    }
}