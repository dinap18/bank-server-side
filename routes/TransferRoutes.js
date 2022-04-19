const  express =  require("express");
const router = express.Router();
const TransferCtrl = require("../controllers/TransferController");


router.get("/", TransferCtrl.apiGetAllTransfers);
router.post("/", TransferCtrl.apiCreateTransfer);
router.get("/user/:id", TransferCtrl.apiGetTransferById);

module.exports =  router;