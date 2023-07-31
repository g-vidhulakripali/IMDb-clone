// Global variables
const apiKey = "b419b1c8";
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const favouriteMovies = document.getElementById("favouriteMovies");

// Function to fetch movie data from API
async function fetchMovieData(searchTerm) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`
    );
    const data = await response.json();
    return data.Search;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

// Function to display search results
function displaySearchResults(movies) {
  searchResults.innerHTML = "";

  if (movies) {
    movies.forEach((movie) => {
      const movieItem = document.createElement("div");
      movieItem.innerHTML = `
                <div class="card mb-2">
                    <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.Title}</h5>
                        <button class="btn btn-primary btn-sm" onclick="addToFavourites('${movie.imdbID}')">Add to Favourites</button>
                        <button class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#movieModal" onclick="showMovieDetails('${movie.imdbID}')">Details</button>
                    </div>
                </div>
            `;
      searchResults.appendChild(movieItem);
    });
  }
}

// Function to display movie details in modal
async function showMovieDetails(movieId) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`
    );
    const data = await response.json();

    const movieDetails = document.getElementById("movieDetails");
    movieDetails.innerHTML = `
            <img src="${data.Poster}" class="img-fluid" alt="${data.Title}">
            <h5 class="mt-3">${data.Title}</h5>
            <p>Year: ${data.Year}</p>
            <p>Plot: ${data.Plot}</p>
            <p>Director: ${data.Director}</p>
            <p>Genre: ${data.Genre}</p>
        `;
  } catch (error) {
    console.log("Error fetching movie details:", error);
  }
}

// Function to add movie to favourites
function addToFavourites(movieId) {
  const favouriteMovieIds = getFavouriteMovieIds();

  if (!favouriteMovieIds.includes(movieId)) {
    favouriteMovieIds.push(movieId);
    localStorage.setItem("favouriteMovies", JSON.stringify(favouriteMovieIds));
    // Scroll back to the "My Favourite Movies" section
    const favouriteSection = document.getElementById("favouriteSection");
    window.scrollTo({
      top: favouriteSection.offsetTop - 100, // Adjust the offset as needed
      behavior: "smooth",
    });

    displayFavouriteMovies();
  }
}

// Function to remove movie from favourites
function removeFromFavourites(movieId) {
  const favouriteMovieIds = getFavouriteMovieIds();

  const index = favouriteMovieIds.indexOf(movieId);
  if (index !== -1) {
    favouriteMovieIds.splice(index, 1);
    localStorage.setItem("favouriteMovies", JSON.stringify(favouriteMovieIds));
    displayFavouriteMovies();
  }
}

// Function to get favourite movie ids from local storage
function getFavouriteMovieIds() {
  return JSON.parse(localStorage.getItem("favouriteMovies")) || [];
}

// Function to display favourite movies
async function displayFavouriteMovies() {
  const favouriteMovieIds = getFavouriteMovieIds();

  favouriteMovies.innerHTML = "";

  for (const movieId of favouriteMovieIds) {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`
      );
      const data = await response.json();

      const movieItem = document.createElement("div");
      // Set the id and class attributes for the div element
      movieItem.setAttribute("id", `movie-card-${data.imdbID}`);
      movieItem.setAttribute("class", "movie-card-div col");
      movieItem.innerHTML = `
                <div class="card mb-2">
                    <img src="${data.Poster}" class="card-img-top" alt="${data.Title}">
                    <div class="card-body">
                        <h5 class="card-title">${data.Title}</h5>
                        <button class="btn btn-danger btn-sm" onclick="removeFromFavourites('${data.imdbID}')">Remove from Favourites</button>
                    </div>
                </div>
            `;
      favouriteMovies.appendChild(movieItem);
    } catch (error) {
      console.log("Error fetching movie details:", error);
    }
  }
}

// Event listener for search input
searchInput.addEventListener("input", async () => {
  const searchTerm = searchInput.value.trim();

  if (searchTerm !== "") {
    const movies = await fetchMovieData(searchTerm);
    displaySearchResults(movies);
  } else {
    searchResults.innerHTML = "";
  }
});

// Event listener when the page loads
window.addEventListener("load", () => {
  displayFavouriteMovies();
});
