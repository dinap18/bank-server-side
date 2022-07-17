const  express =  require("express");
const router = express.Router();
const TransferCtrl = require("../controllers/TransferController");


router.get("/", TransferCtrl.apiGetAllTransfers);
router.post("/", TransferCtrl.apiCreateTransfer);
router.get("/:id", TransferCtrl.apiGetTransferById);
router.get("/to/:id", TransferCtrl.apiGetTransfersToById);
router.get("/from/:id", TransferCtrl.apiGetTransfersFromById);

module.exports =  router;