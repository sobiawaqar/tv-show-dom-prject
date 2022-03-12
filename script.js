//nav bar tools and buttons declaration
let root = document.getElementById("root");
const searchBar = document.getElementById("search");
const showSearch = document.getElementById("select-show");
const showEpisode = document.getElementById("select-episode");
let mybutton = document.getElementById("myBtn");
const counter = document.getElementById("counter");
const episodeEl = document.createElement("episodeEl");
let episodeContent;
let allEpisodes;
let shows;

//will call all the functions
function setup() {
  let root = document.getElementById("root");
  shows = getAllShows();
  makePageForShows();
  showSelect();
  createDropdown();
  homeBtn();
}

//This function will display the show's select box with a clickable link
function showSelect() {
  const showSearch = document.getElementById("select-show");
  let showOption = document.getElementById("show-option");
  let allShows = getAllShows();
  allShows.forEach((show) => {
    let option = document.createElement("option");
    option.innerHTML = `${show.name}`;
    showSearch.appendChild(option);
    option.value = show.id;
  });

  showSearch.addEventListener("change", function (e) {
    let showId = e.target.value;
    // fetch is used to get data  // catch will find the errors which are not visible
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        allEpisodes = data;
        makePageForEpisodes(allEpisodes);
        createDropdown(allEpisodes);
      })
      .catch((error) => {});
  });
}
//makes display
function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

//make the Homepage clickable to return homepage
function homeBtn() {
  let btn = document.getElementById("homeBtn");
  btn.addEventListener("click", () => {
    setup();
    const showSearch = document.getElementById("select-show");
    const select = document.getElementById("select-episode");

    showSearch.value = "";
    select.value = "";
  });
}
//level 100
function makeOneEpisode(ep) {
  const episodeContent = document.createElement("episodeContent");
  const heading = document.createElement("heading");
  const img = document.createElement("img");
  const p = document.createElement("p");
  heading.innerText = ep.name + ` S${pad(ep.season, 2)} E${pad(ep.number, 2)}`;
  img.src = `${ep.image.medium}`;
  p.innerHTML = ep.summary;
  episodeContent.appendChild(heading);
  episodeContent.appendChild(img);
  episodeContent.appendChild(p);

  return episodeContent;
}
//creates the pages to display the shows and their episodes
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  episodeEl.innerHTML = "";
  episodeList.forEach(function (ep) {
    episodeEl.appendChild(makeOneEpisode(ep));
  });
  rootElem.appendChild(episodeEl);
}

//this function will display the shows when the page is loaded.
function displayShows(shows) {
  const episodeContent = document.createElement("episodeContent");
  const heading = document.createElement("heading");
  const img = document.createElement("img");
  const p = document.createElement("p");

  // adding more information to the page for users
  const status = document.createElement("status");
  const rating = document.createElement("rating");
  const genre = document.createElement("genre");
  const runtime = document.createElement("runtime");

  heading.innerText = shows.name;
  img.src = shows.image?.medium;
  p.innerText = shows.summary;

  rating.innerHTML = `Average User Rating: <span class="rating">${shows.rating.average}</span>`;
  status.innerHTML = `Status: ${shows.status}`;
  genre.innerHTML = `Genre: ${shows.genres}`;
  runtime.innerHTML = `Released Date: ${shows.premiered}`;

  episodeContent.value = shows.id;
  heading.value = shows.id;
  episodeContent.appendChild(heading);
  episodeContent.appendChild(img);
  episodeContent.appendChild(p);
  episodeContent.appendChild(status);
  episodeContent.appendChild(rating);

  episodeContent.appendChild(genre);
  episodeContent.appendChild(runtime);

  //use of fetch and catch error
  heading.addEventListener("click", function (e) {
    let showId = e.target.value;
    console.log(showId);
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        allEpisodes = data;
        makePageForEpisodes(allEpisodes);
        createDropdown(allEpisodes);
      })
      .catch((error) => {});
  });

  return episodeContent;
}

// level 200
//this search-bar is for dropdown of all episodes for user to select
searchBar.addEventListener("input", () => {
  const searchInput = searchBar.value.trim().toLowerCase();
  const filterEpisodes = allEpisodes.filter((episode) => {
    if (episode.name.toLowerCase().includes(searchInput)) {
      return true;
    } else if (episode.summary.toLowerCase().includes(searchInput)) {
      return true;
    } else {
      return false;
    }
  });

  makePageForEpisodes(filterEpisodes);

  counter.innerText = `Displaying ${filterEpisodes.length}/${allEpisodes.length} episodes`;
});

//this search-bar is for dropdown of all shows for user to select
searchBar.addEventListener("input", () => {
  const searchInput = searchBar.value.trim().toLowerCase();
  const filterShows = allShows.filter((episode) => {
    if (shows.name.toLowerCase().includes(searchInput)) {
      return true;
    } else if (shows.summary.toLowerCase().includes(searchInput)) {
      return true;
    } else {
      return false;
    }
  });

  makePageForShows(filterShows);

  counter.innerText = `Displaying ${filterShows.length}/${allShows.length} shows`;
});

//This function will make a page for all the shows
function makePageForShows() {
  let root = document.getElementById("root");
  let showAll = getAllShows();
  // let shows = getAllShows();
  episodeEl.innerHTML = "";
  showAll.forEach((show) => {
    episodeEl.appendChild(displayShows(show));
  });
  root.appendChild(episodeEl);
}
//This function will help to clear the search and re set  the page. program runs without it also
function reset() {
  const select = document.getElementById("select-episode");
  select.innerHTML = "";
}

//level 300
function createDropdown(episodes) {
  const select = document.getElementById("select-episode");
  select.innerHTML = "";
  if (allEpisodes && allEpisodes.length) {
    allEpisodes.forEach((episode) => {
      let option = document.createElement("option");
      option.innerHTML = `S${pad(episode.season, 2)}E${pad(
        episode.number,
        2
      )} - ${episode.name}`;
      select.appendChild(option);
      option.value = episode.id;
    });
  }

  select.addEventListener("keyup", (e) => {
    let id = e.target.value;
    let selectedEpisode = allEpisodes;
    if (id !== "") {
      selectedEpisode = allEpisodes.filter((ep) => {
        return "" + ep.id === id;
      });
    }
    makePageForEpisodes(selectedEpisode);
  });
}

window.onscroll = function () {
  scrollFunction();
};
//This function will help to create a button when the page is scrolled down - the button will appear after 500px moving down of page
function scrollFunction() {
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button "Back to Top", it will scroll to the top of the document
function goTopFunction() {
  document.documentElement.scrollTop = 0;
}

window.onload = setup;

/* 
//truncating text
 function truncatePara(str, num) {
  if(num >= str.length){return str;
  if(num<=3) return str.slice(0, num) + "...";
  return str.slice (0, num-3) + "...";
}
truncatePara(shows.summary, 17);
*/
