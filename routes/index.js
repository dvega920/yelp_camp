let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/user');

// SHOW REGISTER FORM
router.route("/register")
    .get(function (req, res) {
        res.render("register");
    })
    // HANDLES SIGNUP LOGIC
    .post(function (req, res) {
        let newUser = new User({ username: req.body.username });
        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.render("register")
            }
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            })
        });
    });

// SHOW LOGIN FORM
router.route("/login")
    .get(function (req, res) {
        res.render("login", { message: req.flash("error") });
    })
    // HANDLES LOGIN LOGIC
    .post(passport.authenticate("local",
        {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }), function (req, res) {
        });

// LOGOUT ROUTE
router.route("/logout")
    .get(function (req, res) {
        req.logOut();
        res.redirect("/campgrounds");
    });

module.exports = router;
