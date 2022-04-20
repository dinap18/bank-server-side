const Loan = require("../models/")("Loan");
const ObjectId = require('mongodb').ObjectId;

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
            return await Loan.create(data);
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