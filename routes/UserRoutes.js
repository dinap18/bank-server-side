const  express =  require("express");
const router = express.Router();
const UserCtrl = require("../controllers/UserController");


router.get("/", UserCtrl.apiGetAllUsers);
router.post("/", UserCtrl.apiCreateUser);
router.get("/user/:id", UserCtrl.apiGetUserById);
router.put("/user/:id", UserCtrl.apiUpdateUser);
router.delete("/user/:id", UserCtrl.apiDeleteUser);

module.exports =  router;