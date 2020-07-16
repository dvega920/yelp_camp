let bodyParser = require("body-parser"),
    Campground = require("./models/campground"),
    express = require("express"),
    exphbs = require("express-handlebars"),
    handlebars = require("handlebars"),
    mongoose = require("mongoose"),
    { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

let PORT = process.env.PORT || 3000;

let app = express();

// MIDDLEWARE

app.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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

// ROUTE RENDERS ALL OF THE CAMPGROUNDS FROM THE DB COLLECTION
app.get("/campgrounds", function (req, res) {

    //QUERY ALL CAMPGROUNDS IN THE DB COLLECTION AND CONSOLE'S ERROR (IF ANY), OTHERWISE RENDERS CAMPGROUDS
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                campground: campgrounds,
                allowProtoMethodsByDefault: true,
                allowProtoPropertiesByDefault: true
            });

        }
    })
});

// SAVES THE DATA FROM THE INPUT FIELDS AND STORES THEM IN A NEW OBJECT 
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

// ROUTE TO DISPLAY THE PAGE WHERE A USER ENTERS IN A NEW CAMPGROUND NAME AND IMAGE
app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

// ROUTE TO DISPLAY CAMPGROUNDS BASED ON ASSIGNED ID IN DB
app.get("/campgrounds/:id", function (req, res) {

    // the code below renders "show" template correctly but page "keeps loading" and err logged reason: Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters

    //QUERY CAMPGROUND WITH PROVIDED ID WHEN USER CLICKS ON "MORE INFO" ON /CAMPGROUNDS
    let id = req.params.id;
    Campground.findById(id, function (err, foundCampground) {
        console.log(foundCampground);
        if (err) {
            console.log(err);
        } else {
            res.render("show", { campground: foundCampground });
        }
    })
});

app.listen(PORT, function () {
    console.log(`App is listening on localhost:${PORT}`);
});
