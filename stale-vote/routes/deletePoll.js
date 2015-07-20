/* global console: false, module: true, require: false */
var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    'use strict';
    var username = req.session.passport.user ? req.session.passport.user.username : '';
    var report = {success: false};
    req.Poll.findOne({_id: req.body.pollId}, function (err, poll) {
        if (err) {
            report.dbQueryError = true;
        } else if (poll && poll.owner === username) {
            req.Vote.find({pollId: req.body.pollId},function(err, votes){
                votes.forEach(function(vote){
                    vote.remove();
                });
            });
            poll.remove();
            report.success = true;
        } else {
            report.whoAreYou = true;
        }
        res.send(report);
    });

});

module.exports = router;