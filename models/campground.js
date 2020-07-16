let mongoose = require('mongoose');

// DB SCHEMA DEFINES STRUCTURE OF DB COLLECTION
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// CREATES A MODEL FROM THE SCHEMA AND ASSIGNS TO VARIABLE TO USE WHEN PERFORMING QUERIES
module.exports = mongoose.model("Campground", campgroundSchema);
