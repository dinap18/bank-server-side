const  express =  require("express");
const router = express.Router();
const LoanCtrl = require("../controllers/LoanController");


router.get("/", LoanCtrl.apiGetAllLoans);
router.post("/", LoanCtrl.apiCreateLoan);
router.get("/:id", LoanCtrl.apiGetLoanById);

module.exports =  router;