/* global console: false, module: true, require: false */
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    'use strict';
    var loggedIn = req.isAuthenticated();
    var question = req.body.question;
    var validQuestion = (question && question !== '');
    if (loggedIn && validQuestion) {
        var newPoll = new req.Poll({
            question: question,
            owner: req.session.passport.user.username,
            isLive: false
        });
        newPoll.save(function(err, poll){
            if (err) {
                res.send({success: false,
                    loggedIn: loggedIn,
                    error: true,
                    validQuestion: validQuestion
                });
            } else {
                res.send({success: true,
                    loggedIn: loggedIn,
                    error: true,
                    validQuestion: validQuestion,
                    pollID: poll.id
                });
            }
        });

    } else {
        res.send({success: false,
            loggedIn: loggedIn,
            error: true,
            validQuestion: validQuestion});
    }

});

module.exports = router;
