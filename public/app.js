// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p>" + data[i].title + "<br />" + data[i].link + "<br /><button id='commentButton' data-id='" + data[i]._id + "'>Comment</button></p>" + "<hr>");
  }
});


// Whenever someone clicks to comment 
$(document).on("click", "#commentButton", function (e) {
  e.preventDefault();
  $("#comments").empty();
  // Save the id 
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function (data) {
      console.log(data);
      // The title of the article
      $("#comments").append("<h4>" + data.title + "</h4></br>");

      // If there's a comment in the article
      if (data.comment) {
        data.comment.forEach(function(comment) {
          var p = $("<p>")
          $("#comments").append("<div>");
          $(p).addClass("titleinput");
          $(p).attr("name", "title");
          $(p).text(comment.title);
          $("#comments").append(p);
          // Place the title of the comment in the title input
          // $(".titleinput").text(comment.title);
          // A textarea to add a new note body
          var text = $("<textarea>");
          text.addClass("bodyinput");
          text.attr("name", "body");
           $(text).val(comment.body);
          $("#comments").append(text);
          // Place the body of the comment in the body textarea
          // $(".bodyinput").val(comment.body);
        }, this); 
      };
      // '<textarea class="bodyinput" name="body"></textarea></br>'

      // An input to enter a new title
      $("#comments").append("<div class='input-field'><input class='newtitleinput' type='text' name='title' id='title'><label for='title'>Title</label></div>");
      // A textarea to add a new note body
      $("#comments").append("<div class='input-field'><textarea id='textarea1' class='newbodyinput materialize-textarea' name='body'></textarea><label for='textarea1'>Comment</label></div>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
      $(".newtitleinput").val("");
      $(".newbodyinput").val("");


    });
});

// When you click the comment button
$(document).on("click", "#savecomment", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $(".newtitleinput").val().trim(),
      // Value taken from note textarea
      body: $(".newbodyinput").val().trim()
    }
  })
    // With that done
    .done(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments").empty();
    });
});


$(".deleteButton").on('click', function() {
  $.ajax({
    method: "Delete",
    url: "/delete/"
  }).done(function(){
      $("#articles").empty();
  });
});