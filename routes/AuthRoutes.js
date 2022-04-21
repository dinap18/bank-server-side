const  express =  require("express");
const router = express.Router();
const AuthCtrl = require("../controllers/AuthController");


router.post("/", AuthCtrl.apiLogin);

module.exports =  router;