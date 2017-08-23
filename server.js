// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

// Requiring our Note and Article models
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/politics");
var db = mongoose.connection;


db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});


db.once("open", function () {
  console.log("Mongoose connection successful.");
});


// Routes
app.get("/scrape", function (req, res) {
  request("https://www.reddit.com/r/politics/", function (error, response, html) {
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("p.title").each(function(i, element) {      

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).text();
      result.link = $(this).children().attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      entry.save(function (err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });
  });
  res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function (req, res) {

  Article.find({}, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

// This will grab an article by it's ObjectId
app.get("/articles/:id", function (req, res) {

  Article.findById({"_id": req.params.id}).populate('comment').exec(function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

// Create a new note or replace an existing note
app.post("/articles/:id", function (req, res) {
      // save the new note that gets posted to the Comment collection
      var newComment = new Comment(req.body);

      // Now, save that entry to the db
      newComment.save(function (err, doc) {
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          Article.findByIdAndUpdate({"_id": req.params.id}, {$push: {"comment": doc._id}}, {new:true}, function (err, newdoc) {
            if (err) {
              res.send(err);
            } else {
              res.send(newdoc);
            }
          });
        };
      });
    });


      // Listen on port 3000
      app.listen(4000, function () {
        console.log("App running on port 4000!");
      });