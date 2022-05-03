const  express =  require("express");
const router = express.Router();
const LevCoinCtrl = require("../controllers/LevCoinController");


router.get("/", LevCoinCtrl.apiGetAllLevCoins);
router.post("/", LevCoinCtrl.apiCreateLevCoin);
router.get("/:id", LevCoinCtrl.apiGetLevCoinByUserId);
router.get("/value/:currency", LevCoinCtrl.apiGetLevCoinValue);
router.put("/:id", LevCoinCtrl.apiUpdateLevCoin);
router.delete("/:id", LevCoinCtrl.apiDeleteLevCoin);

module.exports =  router;