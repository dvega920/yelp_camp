let express = require('express');
let router = express.Router({ mergeParams: true });
let Campground = require('../models/campground');
let Comment = require('../models/comment');

// COMMENTS NEW
router.route("/new")
    .get(isLoggedIn, function (req, res) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                console.log(err);
            } else {
                res.render("comments/new", { campground: campground });
            }
        })

    })
// COMMENTS CREATE
router.route("/")
    .post(isLoggedIn, function (req, res) {
        //LOOKUP CAMPGROUND BY ID
        console.log(req.params);
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                console.log(err);
                res.redirect("/campgrounds")
            } else {
                //create new comment
                Comment.create(req.body.comment, function (err, comment) {
                    if (err) {
                        console.log(err);
                    } else {
                        //add username and id to comment
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        //save coment
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        console.log(comment);
                        //redirect to campground show page
                        res.redirect("/campgrounds/" + campground._id);
                    }
                })
            }
        })
    });

//-------- MIDDLEWARE ---------//
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router;

