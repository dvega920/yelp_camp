let express = require('express');
let router = express.Router();
let Campground = require('../models/campground');
const campground = require('../models/campground');

// INDEX - ROUTE RENDERS ALL OF THE CAMPGROUNDS
router.get("/", function (req, res) {

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
});
// CREATE - ROUTE SAVES THE DATA FROM THE INPUT FIELDS AND STORES THEM IN A NEW OBJECT 
router.post("/", isLoggedIn, function (req, res) {
    // get data from form and add to campgrounds area
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = { name: name, image: image, description: description, author: author };
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

// NEW - ROUTE TO DISPLAY THE PAGE WHERE A USER ENTERS IN A NEW CAMPGROUND NAME AND IMAGE
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - ROUTE TO DISPLAY CAMPGROUNDS BASED ON ASSIGNED ID IN DB 
router.get("/:id", function (req, res) {

    //QUERY CAMPGROUND WITH PROVIDED ID WHEN USER CLICKS ON "MORE INFO" ON /CAMPGROUNDS
    let id = req.params.id;
    Campground.findById(id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    })
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground })
    })
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, function (req, res) {

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};

function checkCampgroundOwnership(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back")
            } else {
                // does user own the campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();

                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
}

module.exports = router;