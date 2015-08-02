/* global console: false, $: false, require: false, __dirname: false, process: false, module: true */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var mongoose = require('mongoose');


var routes = require('./routes/index');
var routesUser = require('./routes/user');
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');
var newPoll = require('./routes/newPoll');
var routesPoll = require('./routes/poll');
var editPoll = require('./routes/editPoll');
var deletePoll = require('./routes/deletePoll');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MONGOOSE TIME =============================================
mongoose.connect(process.env.MONGOLAB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    'use strict';
    console.log('connected to mongoose');

});
// SCHEMA TIME ===============================================
var userSchema = mongoose.Schema({
    username: String,
    password: String
});
var pollSchema = mongoose.Schema({
    owner: String,
    question: String,
    scores: Array,
    choices: Array,
    isLive: Boolean
});
var voteSchema = mongoose.Schema({
    pollId: [mongoose.Schema.Types.ObjectId],
    userId: [mongoose.Schema.Types.ObjectId],
    choice: Number
});
userSchema.methods.verifyPassword = function (passwordToCheck) {
    'use strict';
    return passwordToCheck === this.password;

};
var User = mongoose.model('User', userSchema);
var Poll = mongoose.model('Poll', pollSchema);
var Vote = mongoose.model('Vote', voteSchema);
app.use(function (req, res, next) {
    'use strict';
    req.User = User;
    req.Poll = Poll;
    req.Vote = Vote;
    next();
});


app.use('/user', routesUser);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.use('/new-poll', newPoll);
app.use('/edit-poll', editPoll);
app.use('/delete-poll', deletePoll);
app.use('/poll', routesPoll);
app.use('/', routes);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    'use strict';
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        'use strict';
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    'use strict';
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

passport.use(new LocalStrategy(
        function (username, password, done) {
            'use strict';
            process.nextTick(function () {

                User.findOne({username: username}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false);
                    }
                    if (!user.verifyPassword(password)) {
                        return done(null, false);
                    }
                    return done(null, user);
                });
            });
        })
);

passport.serializeUser(function (user, done) {
    'use strict';
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    'use strict';
    done(null, user);
});

function ensureAuthenticated(req, res, next) {
    'use strict';
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = app;
