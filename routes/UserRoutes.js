const  express =  require("express");
const router = express.Router();
const UserCtrl = require("../controllers/UserController");


router.get("/", UserCtrl.apiGetAllUsers);
router.post("/", UserCtrl.apiCreateUser);
router.get("/:id", UserCtrl.apiGetUserById);
router.put("/:id", UserCtrl.apiUpdateUser);
router.delete("/:id", UserCtrl.apiDeleteUser);

module.exports =  router;