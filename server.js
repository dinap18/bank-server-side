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

const socketio = require('socket.io');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var LoanController = require('./controllers/LoanController')

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
app.disable('etag');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./core/users');
const jwt = require("jsonwebtoken");
const {MongoClient} = require("mongodb");

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

let chat = require(__dirname + '/routes/ChatRoutes.js')
app.use("/api/v1/chat", chat);

let gmail = require(__dirname + '/routes/MailRoutes.js')
app.use("/api/v1/gmail", gmail);


// launch ======================================================================
let server = app.listen(port);

console.log('The magic happens on port ' + port);


const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


const uri = "mongodb+srv://project:project@bank-app.d3vg0.mongodb.net/bank-app?retryWrites=true&w=majority";
const client = new MongoClient(uri);


client.connect();

client.once("open", () => {

    const database = client.db("bank-app");
    const userCollection = database.collection("users");
    console.log("MongoDB database connected");
    console.log("Setting change streams");
    const userPipeline = [{
        $match: {
            $and: [
                {"updateDescription.updatedFields.accountBalance": {$lte: 0}},
                {operationType: "update"}]
        }
    }];

    var options = {fullDocument: 'updateLookup'};
    const userChangeStream = userCollection.watch(userPipeline,options);

    userChangeStream.on("change", (changes) => {

        io.compress(true).emit('mongoStream', changes);
        console.log("account balance less than zero \t")
    })


    const loanCollection = database.collection("loans");
    loanCollection.find({
        date: {$lte: new Date()},
        moneySent: false
    }).toArray(async function (err, docs) {
        if (docs) {
            for (let i = 0; i < docs.length; i++) {
                await LoanController.apiTransferCreatedLoan(docs[i])
            }

        } else {
            console.log("No loans need tp be transferred");
        }
    });


})


io.on('connect', (socket) => {
    socket.on('join', ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, room});

        if (error) return callback(error);

        socket.join(user.room);

        socket.emit('message', {user: 'admin', text: `Welcome to Chain Bucks!`});
        socket.emit('message', {
            user: 'admin',
            text: `We hope you are are enjoying our unique currency, LevCoin, and banking services`
        });
        socket.emit('message', {user: 'admin', text: `We are happy to help with any issue that may arise`});
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined!`});

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', {user: user.name, text: message});

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', {user: 'Admin', text: `${user.name} has left.`});
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});
