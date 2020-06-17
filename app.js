let express = require("express"),
    handlebars = require("handlebars"),
    exphbs = require("express-handlebars"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

let PORT = process.env.PORT || 3000;

let app = express();

app.engine('handlebars', exphbs({
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));

app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/yelp_camp",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

let Campground = mongoose.model("Campground", campgroundSchema);


app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    //Get all campgrounds from DB
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

app.post("/campgrounds", function (req, res) {
    // get data from form and add to campgrounds area
    let name = req.body.name;
    let image = req.body.image;
    let description = "This is a description";
    let newCampground = { name: name, image: image, description: description };
    // campgrounds.push(newCampground);

    Campground.create(newCampground, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log("Newly Created Campground");
            console.log(campground);
        }
    });

    //redirect to campgrounds page
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.get("/campgrounds/:id", function (req, res) {
    // the code below renders "show" template correctly but page "keeps loading" and err logged   reason: Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters

    //find camp ground with provided ID
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
