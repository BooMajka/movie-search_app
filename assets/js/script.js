// variables
var searchBoxEl = document.querySelector("#title");
var searchButtonEl = document.querySelector("#search-button");
var watchListEl = document.querySelector("#watch-list");
var repoListEl = document.querySelector("#repo-list");
var warningEl = document.querySelector(".input-field");
var warningParagraphEl = document.querySelector(".warning");
var titleInfoEl = document.querySelector("#title-info");
var titleSummary = document.querySelector("#title-summary");
var modalTitleEl = document.querySelector("#modal-title");
var modalSummaryEl = document.querySelector("#modal-summary");
var modalImageEl = document.querySelector("#modal-image");
var modalButtonEl = document.querySelector("#modal-button");
var yearButtonEl = document.querySelector(".with-gap");
var covidInfoEl = document.querySelector(".covid-info");
var savedMovies = [];
//API Keys to pull in data
var ApiKey = "1d758f3d2b1a8c8efada332dc1acd449";

var displayFromLocalStorage = function () {
  var saveMov = JSON.parse(localStorage.getItem("savedMovies"));
  if (saveMov) {
    watchListEl.innerHTML = "";
    saveMov.forEach((el) => {
      var div = document.createElement("div");
      div.classList.add("watch-list_element");
      var span = document.createElement("span");
      span.textContent = "x";
      span.addEventListener("click", function () {
        deleteFromLocalStorage(el);
      });
      var img = document.createElement("img");
      img.classList.add("watch-list_img");
      img.setAttribute("src", "https://image.tmdb.org/t/p/original" + el);
      div.appendChild(img);
      div.appendChild(span);
      watchListEl.appendChild(div);
    });
  }
};
displayFromLocalStorage();

//submit form handler
var submitFormHandler = function (event) {
  event.preventDefault();
  var movie = searchBoxEl.value.toLowerCase().trim();

  if (movie) {
    warningParagraphEl.classList.remove("show");
    repoListEl.innerHTML = "";
    getMovie(movie);
  } else {
    warningParagraphEl.classList.add("show");
  }
};

// function to search movie title
var getMovie = function (titleName) {
  var apiUrl =
    "https://api.themoviedb.org/3/search/movie?&api_key=" +
    ApiKey +
    "&query=" +
    titleName;

  //fetch API for titles and then display data
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayTitles(data.results);
        console.log(data)
      });
    } else {
      console.log(response.statusText);
    }
  });
};

// get covid data and fetch
var getCovidData = function () {   
  var covidApiUrl =
  "https://corona.lmao.ninja/v2/all?yesterday";

  fetch(covidApiUrl).then(function (response) {
  
    // console.log(response);
    if (response.ok) {
      response.json().then(function (covidData) {
        console.log(covidData);
        var div = document.createElement("div");
        div.classList.add("covid-cases")
        div.innerHTML = "<p>Today's new Covid cases: " + covidData.todayCases + "    |    Today's recovered cases: " + covidData.todayRecovered + "    |    Today's Deaths: " + covidData.todayDeaths + "</p>"
        covidInfoEl.appendChild(div);
      });
    } else {
      // console.log(response.statusText);
    }
  });
}


// display movie titles
var displayTitles = function (titles) {
  var display = titles.splice(10);
  display.forEach((el) => {
    var moviesListItem = document.createElement("div");
    var moviesThumb = document.createElement("img");
    moviesListItem.style.display = "flex";
    moviesListItem.style.padding = "10px";
    moviesThumb.style.marginRight = "10px";
    var moviesInfo = document.createElement("div");
    if (el.poster_path == null) {
      moviesThumb.setAttribute("src", "./image-not-found.png");
      moviesThumb.style.width = "50px";
      moviesThumb.style.height = "70px";
    } else {
      moviesThumb.setAttribute(
        "src",
        "https://image.tmdb.org/t/p/original" + el.poster_path
      );
      moviesThumb.style.width = "50px";
      moviesThumb.style.height = "70px";
    }
    moviesInfo.innerHTML =
      "<p>" + el.title + "</p><p>" + el.release_date + "</p>";
    moviesListItem.append(moviesThumb);
    moviesListItem.append(moviesInfo);
    moviesListItem.setAttribute("class", "card");
    repoListEl.appendChild(moviesListItem);

    moviesListItem.addEventListener("click", function (event) {
      var elem = document.querySelector("#modal1");
      var instance = M.Modal.init(elem);
      instance.open();
      modalTitleEl.textContent = el.title;
      modalSummaryEl.textContent = el.overview;
      modalImageEl.setAttribute(
        "src",
        "https://image.tmdb.org/t/p/original" + el.poster_path
      );
      modalButtonEl.addEventListener("click", function () {
        saveLocalStorage(el.poster_path);
        displayFromLocalStorage();
        // we were having trouble callign the data instantly when modal initiated.
        //By binding the function to the event lister we are supposedly calling it there.
        //Supposedly by writing it the above way instead we are now assigning the function to a handler.
        //I don't fully understand, but maybe it does what we want now?
      });
    });
  });
};

// //function to sort by year
// var getMovieYear = function(display) {
//   console.log(display.release_date);
//   display.forEach((el,index) => {
  
//   if (yearButtonEl.checked == true) {
//     display.release_date.sort
    
//   } else {

//   }
// })

function saveLocalStorage(item) {
  console.log(item);
  var savedFilms = JSON.parse(localStorage.getItem("savedMovies")) || [];
  if (!savedFilms.includes(item)) {
    savedFilms.push(item);
  }
  localStorage.setItem("savedMovies", JSON.stringify(savedFilms));
}

/// this function is not working, I think we should replace savedMovies from array, to array of objects with title and paths. Then we should be able to delete specific listing.
function deleteFromLocalStorage(element) {
 
  var savedFilms = JSON.parse(localStorage.getItem("savedMovies"))
  // console.log(savedFilms);
  savedFilms.forEach((el,index) => {
    // console.log(savedFilms)
    if (el === element) {
      savedFilms.splice(index, 1);
      console.log(savedFilms)
      localStorage.setItem("savedMovies", JSON.stringify(savedFilms));
      displayFromLocalStorage();
    };
  });
}

// submit button
searchButtonEl.addEventListener("click", submitFormHandler);
document.body.addEventListener("load", getCovidData());




