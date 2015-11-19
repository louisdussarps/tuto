// set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');// log requests to the console (express4)
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');// pull information from HTML POST (express4)
var methodeOverride = require('method-override');// simulate DELETE and PUT (express4)
var session = require('express-session'); // session


var configDB = require('./config/database');

// param
var port = process.env.PORT || 8080;


// configuration
mongoose.connect(configDB.url); // connect to the database

require('./config/passport')(passport); // pass passport configuration

// set up express app
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));// log every request to the console
app.use(cookieParser()); // read cookies (for auth)
app.use(bodyParser.urlencoded({'extended': 'true'}));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());// parse application/json
// parse application/vnd.api+json as json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// require for passport
app.use(session({
    secret: process.env.SESSION_SECRET || '<mysecret>',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login session
app.use(flash()); // use connect-flash for flash messages stored in session

//app.use(methodeOverride());

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodeOverride('X-HTTP-Method-Override')); 


// load routes
require('./app/routes')(app, passport);

// listen (start app with node server.js)
app.listen(port);
console.log("App listening on port %d", port);