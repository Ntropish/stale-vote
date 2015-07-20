/* global console: false, module: true, require: false */
var express = require('express');
var router = express.Router();

router.get('/:POLL_ID', function(req, res){
    'use strict';
    var username = req.session.passport.user? req.session.passport.user.username:'';
    req.Poll.findOne({_id:req.params.POLL_ID}, function(err, poll){
        if (err) {
            res.send(err);
        } else if (poll) {
            res.render('editPoll', {
                username: username,
                loggedIn: req.isAuthenticated(),
                poll: poll
            });
        } else {
            res.send('no error and no poll found');
        }
    });
    console.log('Hello?');
});

router.post('/:POLL_ID', function(req,res) {
    'use strict';
    var username = req.session.passport.user? req.session.passport.user.username:'';
    req.Poll.findOne({_id:req.params.POLL_ID}, function(err, poll){
        var report = {pollID: req.params.POLL_ID};
        if (err) {
            report.findError = true;
            report.success = false;
        } else if (poll && poll.owner === username && poll.isLive === false) {
            var choices = req.body['choices[]'];
            if (typeof choices === String) {
                choices = [choices];
            }
            poll.choices = choices;
            if (req.body.goLive) {
                poll.choices.forEach(function(){
                    poll.scores.push(0);
                });
            }
            poll.isLive = req.body.goLive;
            poll.save();
            report.success = true;
        } else {
            report.whoAreYou = true;
        }
        res.send(report);
    });
});

module.exports = router;