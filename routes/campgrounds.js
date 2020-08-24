let express = require('express');
let router = express.Router();
let Campground = require('../models/campground');
let middlewareObj = require('../middleware');

// INDEX - ROUTE RENDERS ALL OF THE CAMPGROUNDS
router.route("/")
    .get(function (req, res) {
        //QUERY ALL CAMPGROUNDS IN THE DB COLLECTION AND CONSOLE'S ERROR (IF ANY), OTHERWISE RENDERS CAMPGROUDS
        Campground.find({}, function (err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campground: allCampgrounds,
                    allowProtoMethodsByDefault: true,
                    allowProtoPropertiesByDefault: true
                });
            }
        })
    })
    // CREATE - ROUTE SAVES THE DATA FROM THE INPUT FIELDS AND STORES THEM IN A NEW OBJECT 
    .post(middlewareObj.isLoggedIn, function (req, res) {
        // get data from form and add to campgrounds area
        let name = req.body.name;
        let price = req.body.price;
        let image = req.body.image;
        let description = req.body.description;
        let author = {
            id: req.user._id,
            username: req.user.username
        };
        let newCampground = { name: name, price: price, image: image, description: description, author: author };
        // CREATES A NEW CAMPGROUND FROM THE NEWCAMPGROUND OBJECT
        Campground.create(newCampground, function (err, campground) {
            if (err) {
                console.log(err);
            } else {
                console.log(campground);
                // redirect back to campgrounds page
                res.redirect("/campgrounds");
            }
        });
    })

// NEW - ROUTE TO DISPLAY THE PAGE WHERE A USER ENTERS IN A NEW CAMPGROUND NAME, PRICE, IMAGE & DESCRIPTION
router.route("/new")
    .get(middlewareObj.isLoggedIn, function (req, res) {
        res.render("campgrounds/new");
    });

// SHOW - ROUTE TO DISPLAY CAMPGROUNDS BASED ON ASSIGNED ID IN DB 
router.route("/:id")
    .get(function (req, res) {
        //QUERY CAMPGROUND WITH PROVIDED ID WHEN USER CLICKS ON "MORE INFO" ON /CAMPGROUNDS
        let id = req.params.id;
        Campground.findById(id).populate("comments").exec(function (err, foundCampground) {
            if (err || !foundCampground) { // Added "OR" statement to fix error handling bug not accounting for null value
                req.flash("error", "Campground not found"); // error handling
                res.redirect("back");
            } else {
                console.log(foundCampground);
                res.render("campgrounds/show", { campground: foundCampground });
            }
        })
    })
    // UPDATE CAMPGROUND ROUTE
    .put(middlewareObj.checkCampgroundOwnership, function (req, res) {

        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        })
    })
    // DESTROY CAMPGROUND ROUTE
    .delete(middlewareObj.checkCampgroundOwnership, function (req, res) {
        Campground.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds");
            }
        })
    });

// EDIT CAMPGROUND ROUTE
router.route("/:id/edit")
    .get(middlewareObj.checkCampgroundOwnership, function (req, res) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            res.render("campgrounds/edit", { campground: foundCampground })
        })
    });

module.exports = router;