const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const  express =  require("express");
const router = express.Router();
const {listMessages, deleteMessage} = require ("../core/gmail");



router.get("/", (req,res)=>listMessages(req,res))
router.delete("/:id", (req,res)=>deleteMessage(req,res))

module.exports = router;