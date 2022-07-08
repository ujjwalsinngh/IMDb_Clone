const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');


search.onclick = function(){
	let searchedTerm = document.getElementById("searchBox").value;
	
	if(searchedTerm.length > 0){
		
		loadMovies(searchedTerm);
	}else{
		searchList.classList.add('hide-search-list');
	}
}

async function loadMovies(searchedTerm){
	// alert(searchedTerm);

	const URL = `https://omdbapi.com/?s=${searchedTerm}&page=1&apikey=fc7888b3&t`;
	const res = await fetch(`${URL}`);
	// alert(res);
	const data = await res.json();

		// alert(data);

	if(data.Response == "True"){
		displayMovieList(data.Search);
	}
}

function displayMovieList(movies){
	// alert(movies);
	// searchBox.value = "";
	for(let idx = 0; idx < movies.length; idx++){
		let movieListItem = document.createElement('div');
		movieListItem.dataset.id = movies[idx].imdbID;
		movieListItem.classList.add('search-list-item');

		if(movies[idx].Poster != "N/A"){
			moviePoster = movies[idx].Poster;
		}else{
			moviePoster = "image_not_found.png";
		}

		movieListItem.innerHTML = `
		<div class = "search-item-thumbnail">
			<img src = "${moviePoster}">
		</div>
		<div class = "search-item-data">
			<h3>${movies[idx].Title}</h3>
			<p>${movies[idx].Year}</p>
		</div>
		`;
		searchList.appendChild(movieListItem);
	}
	// alert(movies[0].Actors);
	loadMovieDetails();
	// alert(movies);
}



function loadMovieDetails(){
	const searchListMovies = searchList.querySelectorAll('.search-list-item');
	// alert(searchListMovies);
	searchListMovies.forEach(movie => {
		movie.addEventListener('click', async () => {
			searchList.classList.add('hide-search-list');
			searchBox.value = "";
			const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc7888b3&t`);
			const movieDetails = await result.json();
			// searchList.classList.add('hide-search-list');
			// alert(movieDetails.Actors);
			displayMovieDetails(movieDetails);
		});
	});
	// alert(searchListMovies); 
}

function displayMovieDetails(movdetails){
	
	var obj = JSON.stringify(movdetails);
	localStorage.setItem("movieKey", obj);
	window.open("file:///Users/ujjwalsingh/Desktop/Sublime/IMDB/imdb_movie_page.html", '_self');
	
}


function getMovieDetailsOnMoviePage(){
	var result = localStorage.getItem("movieKey");
	var details = JSON.parse(result);

	resultGrid.innerHTML = `
	<h1 class = "movie-title">${details.Title}</h1>
	<h6 class="year">${details.Year}</h6>
	<span class="imdb-rating">
		<h5 class="rating-text">IMDb RATING</h5>
		<span class="rating">${details.imdbRating}/10</span>
	</span>
	<h6 class = "released">Released : ${details.Released}</h6>
	<div class = "movie-poster">
		<img src = "${(details.Poster != "N/A") ? details.Poster : "image not found"}" alt = "movie poster">
		<span class="add-to-favourites" id="${details.imdbID}" onclick="addToFavourites(this)">
			<span class="bookmark-icon" id="bookmark-icon"><i class="fa-solid fa-bookmark"></i></span>
			<span class="bookmark-plus-icon" id="bookmark-plus-icon"><i class="fa-solid fa-plus"></i></span>
		</span>
	</div>
	
	<div class = "movie-data">
		<div class="genre-container">
			<h5 class="genre-text">GENRE<h5>
			<span class="genre">${details.Genre}</span>
		</div>
		<p class = "plot"><b>Plot : </b> ${details.Plot}</p>
	</div>
	`;
}

function watchlist(){
	window.open("file:///Users/ujjwalsingh/Desktop/Sublime/IMDB/imdb_favourites.html", '_self');
}

function redirectToHome(){
	// alert(this.id);
	window.open("file:///Users/ujjwalsingh/Desktop/Sublime/IMDB/imdb_home.html", '_self');

}



function addToFavourites(ele){

	let oneTimer = localStorage.getItem("favour8");

	if(oneTimer == null){
		// var arr = [];
		// arr.push(ele.id);
		// localStorage.setItem("favour8", JSON.stringify(arr));
		// alert("len");
	}else{
		var array = localStorage.getItem("favour8");
		if(array){
			var favArray = JSON.parse(array);
			const addedToFavourites = document.getElementById('bookmark-plus-icon');
			if(!favArray.includes(ele.id)){
				favArray.push(ele.id);
				localStorage.setItem("favour8", JSON.stringify(favArray));

				// addedToFavourites.style.backgroundColor = 'red';
				// addedToFavourites.style.opacity = 1;
				// addedToFavourites.innerHTML = '-';
				// addedToFavourites.style.size = "17px";
				alert(ele.id);
				alert("Added to Favourites");
			}else{
				// remove from favourites

				for(let index=0; index<favArray.length; index++){
					if(favArray[index] == ele.id){
						favArray.splice(index, 1);
						localStorage.setItem("favour8", JSON.stringify(favArray));

						// addedToFavourites.style.backgroundColor = 'lightgrey';
						// addedToFavourites.style.opacity = 0.4;
						alert(ele.id);
						alert("Removed from Favourites");
					}
				}
			}
			
		}else{
			var favouritesArray = [];
			favouritesArray.push(ele.id);
			localStorage.setItem("favour8", JSON.stringify(favouritesArray));
			alert("here");
		}
	}
}



function getFavourites(){

	window.open("file:///Users/ujjwalsingh/Desktop/Sublime/IMDB/imdb_favourites.html", '_self');

	let favouritesList = document.getElementById("movie-container");

	var favMovies = JSON.parse(localStorage.getItem('favour8'));
	alert(favMovies.length);

	favMovies.splice(0, 1);
	// for(let index=0; index<=favMovies.length; index++){
	// 	// let favouritesListItem = document.createElement("li");
	// 	// alert(index);
	// 	loadMoviesonFavouritesPage(favMovies[index]);
	// }

	for(element of favMovies){
		loadMoviesonFavouritesPage(element);
	}
}



async function loadMoviesonFavouritesPage(passedID){

	let url = `https://omdbapi.com/?i=${passedID}&apikey=fc7888b3&t`;
	alert(url);


	let response = await fetch(`${url}`);
	alert(JSON.stringify(response));
	let dataa = await response.json();
	alert(JSON.stringify(dataa));

	if(dataa.Response == "True"){
		// alert(JSON.stringify(dataa));
		// displayFavouritesMovieList(data.Search);
	}
}

