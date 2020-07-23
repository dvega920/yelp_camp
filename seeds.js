let mongoose = require('mongoose');
let Campground = require('./models/campground');
let Comment = require('./models/comment');

let data = [
    {
        name: "Cloud's Rest",
        image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "Blah Blah Blah"
    },
    {
        name: "Night Desert",
        image: "https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "Blah Blah Blah"
    },
    {
        name: "Desert Mesa",
        image: "https://images.pexels.com/photos/712067/pexels-photo-712067.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "Blah Blah Blah"
    }
]

function seedDB() {
    //Remove campgrounds
    Campground.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds");
        //Add a few campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("added a campground");
                    //Add comments
                    Comment.create(
                        {
                            text: "This is great, but I wish there was internet",
                            author: "Homer"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save()
                                console.log("Created New Comment");
                            }
                        }
                    )
                }
            });
        });
    });
}

module.exports = seedDB;
