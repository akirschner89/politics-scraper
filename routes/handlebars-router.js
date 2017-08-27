var express = require("express");
var router = express.Router();

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

  module.exports = router;