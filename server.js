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
app.use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json());
// required for passport
app.use(session({secret: 'secret'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
let users = require(__dirname + '/routes/UserRoutes.js')
app.use("/api/v1/users", users);

// launch ======================================================================
let server = app.listen(port);

console.log('The magic happens on port ' + port);
