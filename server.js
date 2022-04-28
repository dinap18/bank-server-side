var express = require('express');
var app = express();
var cors = require('cors');
app.use(
    cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true // allow session cookie from browser to pass through
    })
);
var port = process.env.PORT || 8000;
var passport = require('passport');
var flash = require('connect-flash');


var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// required for passport
app.use(session({secret: 'secret'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.set('secretKey', 'bankServerSecretKey');

function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({status: "error", message: err.message, data: null});
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });

}

// handle errors
app.use(function (err, req, res, next) {
    console.log(err);

    if (err.status === 404)
        res.status(404).json({message: "Not found"});
    else
        res.status(500).json({message: "Something looks wrong :( !!!"});
});

// routes ======================================================================
let users = require(__dirname + '/routes/UserRoutes.js')
app.use("/api/v1/user", users);

let loans = require(__dirname + '/routes/LoanRoutes.js')
app.use("/api/v1/loan", loans);

let transfers = require(__dirname + '/routes/TransferRoutes.js')
app.use("/api/v1/transfer", transfers);

let levCoins = require(__dirname + '/routes/LevCoinRoutes.js')
app.use("/api/v1/levcoin", levCoins);

let auth = require(__dirname + '/routes/AuthRoutes.js')
app.use("/api/v1/auth", auth);


// launch ======================================================================
let server = app.listen(port);

console.log('The magic happens on port ' + port);

const currency = require(__dirname + "/core/Currency")
const jwt = require("jsonwebtoken");
const {MongoClient} = require("mongodb");


const uri = "mongodb+srv://project:project@bank-app.d3vg0.mongodb.net/bank-app?retryWrites=true&w=majority";
const client = new MongoClient(uri);


client.connect();

client.once("open", () => {
    console.log("MongoDB database connected");
    const database = client.db("bank-app");
    const userCollection = database.collection("users");
    console.log("Setting change streams");
    const userPipeline = [{$match: {accountBalance: {$lte: 0}}}];
    const userChangeStream = userCollection.watch(userPipeline);

    const loanCollection = database.collection("loans");

    const loanPipeline = [
        {$match: {and: [{accountBalance: {$lte: new Date(Date.now())}}, {moneySent: false}]}}
    ];
    const loanChangeStream = loanCollection.watch(loanPipeline);


    userChangeStream.on("change", (change) => {


        console.log("account balance less than zero \t")
    })
    loanChangeStream.on("change", (change) => {


        console.log("loan money \t")
    })


})
