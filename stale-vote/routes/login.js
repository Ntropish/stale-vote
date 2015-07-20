/* global console: false, module: true, require: false */
var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res){
    'use strict';
    var username = req.session.passport.user? req.session.passport.user.username:'';
    res.render('login', {
        username: username,
        greeting: req.isAuthenticated()? 'Welcome, '+req.session.passport.user.username:'Hello!',
        loggedIn: req.isAuthenticated()
    });
});

router.post('/', function(req, res, next) {
    'use strict';
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            res.send({success: false});
            return next(err);
        }
        if (!user) {
            return res.send({success: false});
        }
        req.logIn(user, function(err) {
            if (err) {
                res.send({success: false});
                return next(err);
            }
            return res.send({success: true});
        });
    })(req, res, next);
});





module.exports = router;