/* global console: false, module: true, require: false */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    'use strict';
    var username = req.session.passport.user? req.session.passport.user.username:'';
    res.render('register', {username: username, loggedIn: req.isAuthenticated()});
});

router.post('/', function(req, res){
    'use strict';
    var userIsAdded = false;
    var usernameIsInvalid = false;
    var passwordIsInvalid = false;
    var usernameIsDuplicate = false;

    req.User.find({username: req.body.username}, function(err, data){
        if (err) {
            return false;
        }

        //Check if user can be created
        if ( data && data.length > 0) {
            usernameIsDuplicate = true;
        }
        if (!req.body.username || req.body.username.match(/[^\w\d]/g)) {
            usernameIsInvalid = true;
        }
        if (!req.body.password || req.body.password.match(/[:/\\\.><';,"\)\(\-\+]/g)) {
            usernameIsInvalid = true;
        }

        //If all checks passed, make user
        if (!usernameIsInvalid && !passwordIsInvalid && !usernameIsDuplicate) {
            try {

                var newUser = new req.User(req.body);
                newUser.save(function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                userIsAdded = true;
            } catch(e) {
                console.log(e);
            }
        }

        //build a report on how the registering went and send it back
        var report = {
            success: userIsAdded,
            usernameIsInvalid: usernameIsInvalid,
            passwordIsInvalid: passwordIsInvalid,
            usernameIsDuplicate: usernameIsDuplicate
        };
        res.send(report);

    });

});

module.exports = router;
