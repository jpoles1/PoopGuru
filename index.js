//Connecting
var mongoose = require('mongoose');
var express = require("express");
var env = require('node-env-file');
env(".env")
var app = express();
mongoose.connect(process.env.MONGOURL);
//Schemas
var sightingSchema = mongoose.Schema({
    bristol: Number,
    date: Date,
    dayofweek: String
});
var Sightings = mongoose.model('sightings', sightingSchema);
var db = mongoose.connection;
var turd = new Sightings({bristol: 4, date: new Date(), dayofweek: "Saturday"})
turd.save(function(err) {
  if (err) throw err;
  console.log('User saved successfully!');
});
