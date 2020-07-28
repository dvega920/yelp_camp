let bodyParser = require("body-parser"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    express = require("express"),
    exphbs = require("express-handlebars"),
    handlebars = require("handlebars"),
    mongoose = require("mongoose"),
    seedDB = require("./seeds"),
    { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user');

seedDB();

let PORT = process.env.PORT || 3000;

let app = express();

// MIDDLEWARE

app.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Passport Config

app.use(require('express-session')({
    secret: "yelpcamp user auth",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DATABASE CONNECTION
mongoose.connect("mongodb://localhost/yelp_camp",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });


// DEFAULT PAGE WHEN APP LOADS. STRUCTURE AND DESIGN...STILL IN PROGRESS
app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX - ROUTE RENDERS ALL OF THE CAMPGROUNDS 
app.get("/campgrounds", function (req, res) {

    //QUERY ALL CAMPGROUNDS IN THE DB COLLECTION AND CONSOLE'S ERROR (IF ANY), OTHERWISE RENDERS CAMPGROUDS
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campground: campgrounds,
                allowProtoMethodsByDefault: true,
                allowProtoPropertiesByDefault: true
            });

        }
    })
});
// CREATE - ROUTE SAVES THE DATA FROM THE INPUT FIELDS AND STORES THEM IN A NEW OBJECT 
app.post("/campgrounds", function (req, res) {
    // get data from form and add to campgrounds area
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description; // there is no input for this yet.
    let newCampground = { name: name, image: image, description: description };
    // campgrounds.push(newCampground);

    // CREATES A NEW CAMPGROUND FROM THE NEWCAMPGROUND OBJECT
    Campground.create(newCampground, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log("Newly Created Campground");
            // console.log(campground);
        }
    });

    //REDIRECTS TO THE /CAMPGROUNDS ROUTE TO DISPLAY NEWLY CREATED OBJECT.
    res.redirect("/campgrounds");
})

// NEW - ROUTE TO DISPLAY THE PAGE WHERE A USER ENTERS IN A NEW CAMPGROUND NAME AND IMAGE
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - ROUTE TO DISPLAY CAMPGROUNDS BASED ON ASSIGNED ID IN DB
app.get("/campgrounds/:id", function (req, res) {

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

// *******************************************
// COMMENT ROUTES
// *******************************************

app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    })

});

app.post("/campgrounds/:id/comments", function (req, res) {
    //lookup campground using ID
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
                    //connect comment to new campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

// =============
// AUTH ROUTES 
// =============

app.get("/register", function (req, res) {
    res.render("register");
});
app.post("/register", function (req, res) {
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


app.listen(PORT, function () {
    console.log(`App is listening on localhost:${PORT}`);
});
