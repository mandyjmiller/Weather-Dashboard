// This is our API key
var APIKey = "166a433c57516f51dfab1f7edaed8413";

// Here we are building the URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
  "q=London,United Kingdom&appid=" + APIKey;

// // Here we run our Fetch call to the OpenWeatherMap API
// fetch(queryURL)
//   .then(function (response) {
//     // Calling .json() to access the json data stored inside the returned promise
//     return response.json();
//   })
//   // We store all of the retrieved data inside of an object called "data"
//   .then(function (data) {

//     // Log the queryURL
//     console.log(queryURL);

//     // Log the resulting object
//     console.log(data);

//     // Transfer content to HTML
//     $(".city").html("<h1>" + data.name + " Weather Details</h1>");
//     $(".wind").text("Wind Speed: " + data.wind.speed);
//     $(".humidity").text("Humidity: " + data.main.humidity);

//     // Convert the temp to Celsius
//     var tempC = data.main.temp - 273.15;

//     // add temp content to html
//     $(".temp").text("Temperature (K) " + data.main.temp);
//     $(".tempC").text("Temperature (C) " + tempC.toFixed(2));

//     // Log the data in the console as well
//     console.log("Wind Speed: " + data.wind.speed);
//     console.log("Humidity: " + data.main.humidity);
//     console.log("Temperature (C): " + tempC);
//   });

  // Initial array of movies
var movies = ["The Matrix", "Dune", "Mr. Right", "The Lion King"];

// displayMovieInfo function re-renders the HTML to display the appropriate content
function displayMovieInfo() {

  var movie = $(this).attr("data-name");
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

  // Creates a Fetch call for the specific movie button being clicked
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Creating a div to hold the movie
      var movieDiv = $("<div class='movie'>");

      // Storing the rating data
      var rating = data.Rated;

      // Creating an element to have the rating displayed
      var pOne = $("<p>").text("Rating: " + rating);

      // Displaying the rating
      movieDiv.append(pOne);

      // Storing the release year
      var released = data.Released;

      // Creating an element to hold the release year
      var pTwo = $("<p>").text("Released: " + released);

      // Displaying the release year
      movieDiv.append(pTwo);

      // Storing the plot
      var plot = data.Plot;

      // Creating an element to hold the plot
      var pThree = $("<p>").text("Plot: " + plot);

      // Appending the plot
      movieDiv.append(pThree);

      // Retrieving the URL for the image
      var imgURL = data.Poster;

      // Creating an element to hold the image
      var image = $("<img>").attr("src", imgURL);

      // Appending the image
      movieDiv.append(image);

      // Putting the entire movie above the previous movies
      $("#movies-view").prepend(movieDiv);
    });
}

// Function for displaying movie data
function renderButtons() {

  // Deleting the movies prior to adding new movies
  // (this is necessary otherwise you will have repeat buttons)
  $("#buttons-view").empty();

  // Looping through the array of movies
  for (var i = 0; i < movies.length; i++) {

    // Then dynamicaly generating buttons for each movie in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    var a = $("<button>");
    // Adding a class of movie-btn to our button
    a.addClass("movie-btn");
    // Adding a data-attribute
    a.attr("data-name", movies[i]);
    // Providing the initial button text
    a.text(movies[i]);
    // Adding the button to the buttons-view div
    $("#buttons-view").append(a);
  }
}

// This function handles events where a movie button is clicked
$("#add-movie").on("click", function (event) {
  event.preventDefault();
  // This line grabs the input from the textbox
  var movie = $("#movie-input").val().trim();

  // Adding movie from the textbox to our array
  movies.push(movie);

  // Calling renderButtons which handles the processing of our movie array
  renderButtons();
});

// Adding a click event listener to all elements with a class of "movie-btn"
$(document).on("click", ".movie-btn", displayMovieInfo);

// Calling the renderButtons function to display the initial buttons
renderButtons();