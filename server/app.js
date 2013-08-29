/*
	Main application file.
	Created by: Edwin Perez
 */

var express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	// io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	passport = require('passport'),
	async = require('async'),
	// Using connect-mongo to store session data on DB
	//MemoryStore = require('connect').session.MemoryStore,
	MongoStore = require('connect-mongo')(express),
	flash = require('connect-flash'),
	LocalStrategy = require('passport-local').Strategy,
	underscore = require('underscore'),
	fs = require('fs');

/**
 * Models
 */

/**
 * Controllers
 */

/**
 * Config
 */

// Mongoose Debugging
// mongoose.set('debug', true);

// Passport configuration
require('./config/passport')(passport, LocalStrategy);

// App configuration
app.configure(function(){
	app.set('trust proxy', true);
	app.set('view engine', 'jade');
	app.set('view options', {layout: true});
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname + '../client'));
	//app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ 
		secret: "Best comic app ever",
		// Max Age set to 8 Hours.
		// cookie: { maxAge: -1 },
		// Using connect-mongo to store sessions on DB.
		store: new MongoStore("comico")
	}));
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	mongoose.connect('mongodb://localhost/comico');
});

// Loading routes
require('./controllers/router')(app, passport, ensureAuthenticated);
require('./controllers/api')(app, passport, ensureAuthenticated);

// Launching App.
app.listen(3000);	

console.log('Application started on port: 3000');

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
// function ensureAuthenticated(req, res, next) {
// 	if (req.isAuthenticated()) { return next(); }

// 	if(req.headers['x-requested-with'] === 'XMLHttpRequest'){
// 		res.send(401);
// 	}else{
// 		res.redirect('/login');	
// 	}
// }