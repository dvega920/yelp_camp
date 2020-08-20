let Campground = require("../models/campground");
let Comment = require("../models/comment");

let middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login")
};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    // Checks to see if user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground) { //added "OR" to fix error handling issue
                req.flash("error", "Campground not found");
                res.redirect("back")
            } else {
                // Checks if logged in user created campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    // Checks to see if user is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) { // added || ("OR") to fix error handling bug that did not account for null values
                req.flash("error", "Comment not found"); // replaced console.log with flash error
                res.redirect("back")
            } else {
                // Checks if logged in user created comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;

