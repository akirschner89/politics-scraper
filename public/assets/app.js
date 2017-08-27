// Get the articles as JSON
$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p id='commentTitle'>" + data[i].title + "</p><p>" + data[i].link + "<br /><button id='commentButton' data-id='" + data[i]._id + "'>Comment</button></p>" + "<hr>");
  }
});


// Whenever someone clicks to comment 
$(document).on("click", "#commentButton", function (e) {
  e.preventDefault();
  $("#comments").empty(); 
  var thisId = $(this).attr("data-id");

  // AJAX call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // Done + add the note information to the page
    .done(function (data) {
      console.log(data);
      $("#comments").append("<h4>" + data.title + "</h4></br>");

      // Render all the comments if they're true
      if (data.comment) {
        data.comment.forEach(function(comment) {
          var p = $("<p>")
          $("#comments").append("<div>");
          $(p).addClass("titleinput");
          $(p).attr("name", "title");
          $(p).text(comment.title);
          $("#comments").append(p);

          var text = $("<textarea>");
          text.addClass("bodyinput");
          text.attr("name", "body");
          $(text).val(comment.body);
          $("#comments").append(text);
        }, this); 
      };

      // For adding a new comment
      $("#comments").append("<div class='input-field'><input class='newtitleinput' type='text' name='title' id='title'><label for='title'>Title</label></div>");
      $("#comments").append("<div class='input-field'><textarea id='textarea1' class='newbodyinput materialize-textarea' name='body'></textarea><label for='textarea1'>Comment</label></div>");
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
      $(".newtitleinput").val("");
      $(".newbodyinput").val("");
    });
});

// When you click the save comment button
$(document).on("click", "#savecomment", function () {
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $(".newtitleinput").val().trim(),
      body: $(".newbodyinput").val().trim()
    }
  })
    .done(function (data) {
      console.log(data);
      $("#comments").empty();
    });
});


