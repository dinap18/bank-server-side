const LoanService = require("../services/LoanService");

module.exports = class Loan{

    static async apiGetAllLoans(req, res, next){
        try {
            const loans = await LoanService.getAllLoans();
            if(!loans){
                res.status(404).json("There are no loans yet!")
            }
            res.json(loans);
        } catch (error) {
            res.status(500).json({error: error})
        }

    }

    static async apiGetLoanById(req, res, next){
        try {
            let id = req.params.id || {};
            const loan = await LoanService.getLoanById(id);
            res.json(loan);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }
    static async apiGetLoansToById(req, res, next){
        try {
            let id = req.params.id || {};
            const loan = await LoanService.getLoansToById(id);
            res.json(loan);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }
    static async apiGetLoansFromById(req, res, next){
        try {
            let id = req.params.id || {};
            const loan = await LoanService.getLoansFromById(id);
            res.json(loan);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static async apiCreateLoan(req, res, next){
        try {

            const createdLoan =  await LoanService.createLoan(req.body);
            res.json(createdLoan);
        } catch (error) {
            res.status(500).json({error: error});
        }
    }



    static async apiTransferCreatedLoan(loan){
        try {

            const createdLoan =  await LoanService.transferLoan(loan);
        } catch (error) {
            console.log("failed to transfer loan")
        }
    }


}