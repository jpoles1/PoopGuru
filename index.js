//Connecting
var mongoose = require('mongoose');
//Setup express
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'))
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
    hour: Number,
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
app.get("/tracker", function(req, res){
  var today = new Date();
  console.log(today)
  console.log("new log:", req.query.bristol)
  var turd = new Sightings({bristol: req.query.bristol, date: today, hour: req.query.hour, dayofweek: weekday[req.query.dow]})
  turd.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully!');
  });
  res.send('Logged!');
});
app.get("/fetchTimeseries", function(req, res){
  Sightings.find(function (err, data) {
    if (err) return console.error(err);
    res.send(JSON.stringify(data));
  })
});
app.get("/fetchdow", function(req, res){
  Sightings.find(function (err, data) {
    if (err) return console.error(err);
    //res.send(JSON.stringify(data));
  })
  var agg = [
    {$group: {
      _id: "$dayofweek",
      count: {$sum: 1}
    }}
  ];
  Sightings.aggregate(agg, function(err, data){
    if (err) { return def.reject(err); }
    plotdata = [];
    for(i in data){
      plotdata.push({name: data[i]._id, y: data[i].count});
    }
    res.send(JSON.stringify(plotdata));
  });
});
app.get("/fetchTimeofday", function(req, res){
  Sightings.find(function (err, data) {
    if (err) return console.error(err);
    //res.send(JSON.stringify(data));
  })
  var agg = [
    {$group: {
      _id: "$hour",
      count: {$sum: 1}
    }}
  ];
  Sightings.aggregate(agg, function(err, data){
    if (err) { return def.reject(err); }
    plotdata = [];
    for(i in data){
      plotdata.push({name: data[i]._id, y: data[i].count});
    }
    res.send(JSON.stringify(plotdata));
  });
});
app.use('/public', express.static('public'));
app.get("/", function(req, res){
  res.render('viz', { title: 'Hey', message: 'Hello there!'});
});
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('Example app listening on port:',port);
})
