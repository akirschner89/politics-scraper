var express = require("express");
var router = express.Router();
// var mongoose = require("mongoose");
// mongoose.Promise = Promise;

// mongoose.connect("mongodb://localhost/politics");
// var db = mongoose.connection;

var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");

router.get("/", function(req, res) {
        res.render("index");
  });

router.get("/articles", function(req, res) {
        res.render("articles.handlebars")
  });

router.get("/scrape", function(req, res) {
        res.render("scrape.handlebars")
  });

router.get("/delete", function(req, res) {
        res.render("delete.handlebars")
  });

// router.post("/articles/:id", function (req, res) {
//     // save the new note that gets posted to the Comment collection
//     var newComment = new Comment(req.body);

//     // Now, save that entry to the db
//     newComment.save(function (err, doc) {
//       if (err) {
//         console.log(err);
//       }
//       // Or log the doc
//       else {
//         Article.findByIdAndUpdate({"_id": req.params.id}, {$push: {"comment": doc._id}}, {new:true}, function (err, newdoc) {
//           if (err) {
//             res.send(err);
//           } else {
//             res.send(newdoc);
//           }
//         })
//       };
//     });
//   });

  module.exports = router;