const  express =  require("express");
const router = express.Router();
const LevCoinCtrl = require("../controllers/LevCoinController");


router.get("/", LevCoinCtrl.apiGetAllLevCoins);
router.post("/", LevCoinCtrl.apiCreateLevCoin);
router.get("/:id", LevCoinCtrl.apiGetLevCoinById);
router.put("/:id", LevCoinCtrl.apiUpdateLevCoin);
router.delete("/:id", LevCoinCtrl.apiDeleteLevCoin);

module.exports =  router;