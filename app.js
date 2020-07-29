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
    User = require('./models/user'),
    commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index')

// seedDB();

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

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//requiring routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// DATABASE CONNECTION
mongoose.connect("mongodb://localhost/yelp_camp",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

app.listen(PORT, function () {
    console.log(`App is listening on localhost:${PORT}`);
});
