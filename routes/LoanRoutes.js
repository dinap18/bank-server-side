const  express =  require("express");
const router = express.Router();
const LoanCtrl = require("../controllers/LoanController");


router.get("/", LoanCtrl.apiGetAllLoans);
router.post("/", LoanCtrl.apiCreateLoan);
router.get("/user/:id", LoanCtrl.apiGetLoanById);

module.exports =  router;