var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create the Note schema
var CommentSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  // Just a string
  body: {
    type: String
  }
});


var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;