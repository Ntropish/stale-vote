/* global console: false, require: false, module: true */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:username/:page', function (req, res) {
    'use strict';
    var user = req.isAuthenticated()? req.session.passport.user.username: '';
    var username = req.params.username;
    var page = req.params.page;
    var pollQuery = req.Poll.find({owner: username});
    req.Poll.count({owner: username}, function (err, count) {
        if (err) {
            console.log('Count error');
            return;
        }
        pollQuery.select('question').skip((page - 1) * 10).limit(10);
        req.Poll.find({owner: username}, function (err, polls) {
            if (err) {
                console.log('Find error');
                return;
            }
            res.render('user', {
                areYourPolls: user === username,
                user: user,
                loggedIn: req.isAuthenticated(),
                username: username,
                greeting: '',
                totalPolls: count,
                polls: polls
            });
        });
    });

});

module.exports = router;
