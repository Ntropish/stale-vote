/* global module: true, require: false */
var express = require('express');
var router = express.Router();
router.get('/', function (req, res) {
    'use strict';
    res.send('poll page');
});

router.get('/:POLL_ID', function (req, res) {
    'use strict';
    var currentChoice;

    function displayPoll(err, poll) {
        if (err) {
            res.send(err);
        } else if (poll) {
            res.render('poll', {
                currentChoice: currentChoice,
                username: username,
                loggedIn: req.isAuthenticated(),
                poll: poll
            });
        } else {
            res.send('no error and no poll found');
        }
    }

    var username = '';

    if (req.isAuthenticated()) {
        username = req.session.passport.user.username;
        req.Vote.findOne({
            pollId: req.params.POLL_ID,
            userId: req.session.passport.user._id
        }, 'choice', function (err, vote) {
            if (err) {
                return false;
            }
            if (vote) {
                currentChoice = vote.choice;
            }
            req.Poll.findOne({
                _id: req.params.POLL_ID
            }, displayPoll);

        });
    } else {
        req.Poll.findOne({_id: req.params.POLL_ID}, displayPoll);
    }
});

router.post('/:POLL_ID', function (req, res) {
    'use strict';
    //posting here represents a voting action

    //report to send back to the client
    var report = {
        success: false,
        isAuthenticated: req.isAuthenticated(),
        pollIsLive: false
    };


    //posting is only permitted if the user is logged in
    if (req.isAuthenticated()) {
        req.Poll.findOne({_id: req.params.POLL_ID}, function (err, poll) {
            //Users can only vote on live polls
            if (poll.isLive) {
                report.pollIsLive = true;
                req.Vote.findOne({
                    pollId: req.params.POLL_ID,
                    userId: req.session.passport.user._id
                }, function (err, vote) {

                    //Updates the 'post' report, used twice below so it is here to stay dry
                    function saveHandler(err) {
                        if (err) {
                            report.saveError = true;
                            report.success = false;
                        } else {
                            report.success = true;
                        }
                        res.send(report);
                    }

                    //if vote exists we just update it, else make a new one
                    if (vote) {
                        poll.scores[vote.choice-1] -= 1;
                        vote.choice = req.body.choice;
                        poll.scores[req.body.choice-1] += 1;
                        poll.markModified('scores');
                        poll.save();
                        vote.save(saveHandler);
                    } else {
                        var newVote = new req.Vote({
                            pollId: req.params.POLL_ID,
                            userId: req.session.passport.user._id,
                            choice: req.body.choice
                        });
                        poll.scores[newVote.choice-1] += 1;
                        poll.markModified('scores');
                        poll.save();
                        newVote.save(saveHandler);

                    }

                });
            } else {
                res.send(report);
            }

        });
    }

});


module.exports = router;