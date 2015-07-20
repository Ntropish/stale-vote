/* global console: false, module: true, require: false */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    'use strict';
    var username = req.session.passport.user? req.session.passport.user.username:'';
    res.render(
        'index',
        {
            username: username,
            title: 'Express',
            greeting: req.isAuthenticated() ? 'Welcome, ' + req.session.passport.user.username : 'Hello!',
            loggedIn: req.isAuthenticated(),
            poll: {
                question: 'Is this a great poll?',
                choices: ['Yes', 'No', 'I guess']
            }
        });
});

module.exports = router;
