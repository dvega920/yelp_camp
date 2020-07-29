let mongoose = require('mongoose');

// DB SCHEMA DEFINES STRUCTURE OF DB COLLECTION
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// CREATES A MODEL FROM THE SCHEMA AND ASSIGNS TO VARIABLE TO USE WHEN PERFORMING QUERIES
module.exports = mongoose.model("Campground", campgroundSchema);

