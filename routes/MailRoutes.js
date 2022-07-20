const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const  express =  require("express");
const router = express.Router();
const {listMessages} = require ("../gmail");



router.get("/", (req,res)=>listMessages(req,res))

module.exports = router;