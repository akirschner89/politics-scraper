// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var path = require("path");
var port = process.env.PORT || 4000; 
var app = express();

mongoose.Promise = Promise;

// Requiring our Note and Article models
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");

// Use morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', express.static(path.join(__dirname, 'public/assets')));

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Database configuration with mongoose
mongoose.connect("mongodb://heroku_x69kpt9j:e3cao52ilh3dgqnu6sgsprpeqn@ds159493.mlab.com:59493/heroku_x69kpt9j");
var db = mongoose.connection;
// string for heroku mLab: mongodb://heroku_x69kpt9j:e3cao52ilh3dgqnu6sgsprpeqn@ds159493.mlab.com:59493/heroku_x69kpt9j
// string for localhost: mongodb://localhost/politics

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

    $("p.title").each(function (i, element) {

      var result = {};

      result.title = $(this).text();
      result.link = $(this).children().attr("href");

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
  res.render("scrape.handlebars");
});

// Get scraped articles
app.get("/articles", function (req, res) {

  Article.find({}, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

// Get article by it's id + it's comments
app.get("/articles/:id", function (req, res) {

  Article.findById({ "_id": req.params.id }).populate('comment').exec(function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

// Post a new comment
app.post("/articles/:id", function (req, res) {
  var newComment = new Comment(req.body);

  // Save new comment to the DB
  newComment.save(function (err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      //find the article's id and update by pushing a new comment
      Article.findByIdAndUpdate({ "_id": req.params.id }, { $push: { "comment": doc._id } }, { new: true }, function (err, newdoc) {
        if (err) {
          res.send(err);
        } else {
          res.send(newdoc);
        }
      });
    };
  });
});

app.get("/delete", function (req, res) {
  Article.deleteMany({}, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.render("delete.handlebars");
    }
  });
});

// Routes <> Handebars
var routes = require("./routes/handlebars-router.js");
app.use("/", routes);

// Listen on port 3000
app.listen(port, function () {
  console.log("App running on PORT: " + port);
});