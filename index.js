//Connecting
var mongoose = require('mongoose');
//Setup express
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//Load Env Data
var env = require('node-env-file');
try{
  env(".env")
}
catch(e){
  console.log("Couldn't get env file", e)
}
mongoose.connect(process.env.MONGOLAB_URI);
//Schemas
var sightingSchema = mongoose.Schema({
    bristol: Number,
    date: Date,
    dayofweek: String
});
var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
var Sightings = mongoose.model('sightings', sightingSchema);
var db = mongoose.connection;
app.post("/tracker", function(req, res){
  var today = new Date();
  console.log("new log:", req.query.bristol)
  var turd = new Sightings({bristol: req.query.bristol, date: today, hour: today.getHours(), dayofweek: weekday[today.getDay()]})
  turd.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully!');
  });
  res.send('Logged!');
});
app.get('/public', function(req, res) {
  app.use(express.static('public/home.html'));
});
app.get("/", function(req, res){
  res.send('Welcome to the Poop Logger!');
});
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('Example app listening on port:',port);
})
