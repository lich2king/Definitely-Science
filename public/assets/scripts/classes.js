document.getElementById('gamesnav').classList.add('selected');

let token = false;

// window.addEventListener('load', async() => {
    // let response = await fetcher(`/auth/check`);

    // if (response.status == 401 || response.status == 403) {
        // token = false;
    // } else {
        // // display points count in navbar
        // token = await response.json();
        // setPointsDisplay(token.points || 0, token.username || "");
    // }
// });

// Load Games
const gamesDiv = document.getElementById('games');
const maxGames = 500;

let selectedTopic = 'all';
let displayedGames = 0;
let games = null;
let sorted;
let hasLoaded = false;
let customcategory = false;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const category = urlParams.get('category');
const search = urlParams.get('search');

let categories = [
    'multiplayer',
    'car',
    'casual',
    'action',
    'shooting',
    'puzzle',
    'classic',
    'sport',
    'clicker',
    'escape',
    '2',
    'horror',
    'hard',
    'music',
    'flash',
];

if (search != null) {
    const input = document.getElementById('searchBar');
    input.focus();
    input.select();
}

if (category != null) {
    selectedTopic = category;

    document.getElementById('topText').style.display = '';
    if (categories[categories.indexOf(category)] > -1) {
        document.getElementById('topText').innerText = `${categories[categories.indexOf(category)].toUpperCase()} Games`;
    } else {
        document.getElementById('topText').innerText = `${category.toUpperCase()} Games`;
    }
    document.getElementById('searchcat').style.display = 'none';

    customcategory = true;
}

let sortObject = (obj) =>
    Object.keys(obj)
    .sort()
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
	
let sortByName = (array) =>
    array.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    });

let findByName = (array, name) => {
        return array.find(element => element.name === name);
    };

//document.addEventListener('DOMContentLoaded', () => {
    // fetcher('/games')
        // .then((response) => response.json())
        // .then((retrievedGames) => {
            // games = retrievedGames;

            // loadCookies();
        // });
//});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        let retrievedGamesRes = await fetch('/assets/ts_games.json');
        games = await retrievedGamesRes.json();
        loadCookies();
    } catch (error) {
        console.error('Error fetching games:', error);
    }
});

async function loadCookies() {
    //when done
    loadTopic();
}

async function loadTopic() {
	if (games == null)
	{
		return;
	}
	
    displayedGames = 0;

    document.getElementById('noSearch').style.display = 'none';

    //sorted = sortObject(games);
	sorted = sortByName(games);

    if (selectedTopic != 'all') {
        if (customcategory) {
            //solves the problem of doing the category parameter on url
            document.getElementsByTagName(
                'title'
            )[0].innerHTML = `${category.toUpperCase()} on Definitely Science`;
            await displayGames();
        }

        const filteredGameCon = document.getElementById('filteredGames');

        const gameButtons = filteredGameCon.querySelectorAll('.all');

        console.log("selectedTopic: " + selectedTopic);

        Array.from(gameButtons).forEach((game) => {
            if (game.classList.contains(selectedTopic)) {
				//let g = games[game.getAttribute('name')];
                let g = findByName(games, game.getAttribute('name'));
                console.log("game " + game.getAttribute('name') + " --- " + g);
				if (g && g.image && g.image != 'undefined')
				{
					game.setAttribute('style', `background-image: url(${g.image})`);
				}
            } else {
                game.setAttribute('style', 'display:none');
            }
        });
    } else {
        gamesDiv.innerHTML = '';
        displayGames();
    }
}

async function displayGames() {
    //First check if there are any new games... if so, put them in the new games category

    let arrowContainer =
        '<div class="arrowsCon"><div class="arrowCon arrowLeftCon" id="arrowLeft" style="visibility: hidden;"><img class="arrow" src="/assets/images/icons/arrow-left.svg"></div><div class="arrowCon arrowRightCon" id="arrowRight" ><img class="arrow" src="/assets/images/icons/arrow-right.svg"></div></div>';

    //Then for each category (except mobile and a few others), make the category container then add games

    for (let i = 0; i < categories.length; i++) {
        gamesDiv.innerHTML += `<h1>${capitalizeFirstLetter(categories[i])} Games <a href="/classes.html?category=${categories[i]}">View More</a></h1>`;

        let row = document.createElement('div');
        row.classList.add('horizontalCon');
        let gamesContainer = document.createElement('div');
        gamesContainer.classList.add('gamesCon');
        gamesContainer.id = `${categories[i]}GamesCon`;
        //add the arrows to the horizontal Con
        row.innerHTML += arrowContainer;

        row.appendChild(gamesContainer);
        gamesDiv.appendChild(row);
    }

    let newGames = [];
    let miscGames = [];

    const filteredGameCon = document.getElementById('filteredGames');

    for (let x = 0; x < Object.keys(sorted).length; x++) {
        let keys = Object.keys(sorted);
        const name = keys[x];

        const data = sorted[keys[x]];

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7 * 3);

        const gameDate = new Date(data.date_added);

        if (gameDate > weekAgo) {
            newGames.push(name);
        }

        filteredGameCon.innerHTML += createGameButton(name, 'filtered');

        //for each game, if it has a tag that matches on of the categories, add it to that container... MAY have multiple!
        let hasCategory = false;
        for (let i = 0; i < categories.length; i++) {
			let tagsList = data.tags;//data.tags.join(' ');
			tagsList = tagsList.replace(/,/g, ' ');
			
            //if (data.tags.join(' ').includes(categories[i])) {
			if (tagsList.includes(categories[i])) {
                hasCategory = true;
                document.getElementById(`${categories[i]}GamesCon`).innerHTML += createGameButton(name);
            }
        }
        if (!hasCategory) {
            //give them misc
            miscGames.push(name);
        }
    }
    if (miscGames.length > 0) {
        gamesDiv.innerHTML += `<h1>Random Games <a href="/classes.html?category=random">View More</a></h1>`;

        let row = document.createElement('div');
        row.classList.add('horizontalCon');
        let gamesContainer = document.createElement('div');
        gamesContainer.classList.add('gamesCon');
        //add the arrows to the horizontal Con
        row.innerHTML += arrowContainer;
        //for each element in newGames, add the game to the horizontalCon
        for (let i = 0; i < miscGames.length; i++) {
            gamesContainer.innerHTML += createGameButton(miscGames[i]);
        }
        row.appendChild(gamesContainer);
        gamesDiv.appendChild(row);
    }

    //recent games

    //for each popular game, add the game to the horizontalCon
    if (token) {
        let recentRow = document.createElement('div');
        recentRow.classList.add('horizontalCon');
        let recentGamesContainer = document.createElement('div');
        recentGamesContainer.classList.add('gamesCon');
        //add the arrows to the horizontal Con
        recentRow.innerHTML += arrowContainer;

        let length = 0;

        let userLikedRes = await fetcher(`/profile/liked/get`);
        let likedgames = await userLikedRes.json();

        length = likedgames.length;
        if (likedgames.length > 0) {
            for (like in likedgames) {
                if (document.getElementsByName(likedgames[like]).length > 0) {
                    recentGamesContainer.innerHTML += createGameButton(likedgames[like]);
                }
            }
        }

        if (length > 0) {
            recentRow.appendChild(recentGamesContainer);
            gamesDiv.prepend(recentRow);
            gamesDiv.innerHTML = `<h1>Liked Games</h1>` + gamesDiv.innerHTML;
        }
    } else {
        let recentRow = document.createElement('div');
        recentRow.classList.add('horizontalCon');
        let recentGamesContainer = document.createElement('div');
        recentGamesContainer.classList.add('gamesCon');
        //add the arrows to the horizontal Con
        recentRow.innerHTML += arrowContainer;

        likedgames = JSON.parse(localStorage.getItem('likedGames') || '{}');
        let length = Object.keys(likedgames).length;

        if (length > 0) {
            for (like in likedgames) {
                if (document.getElementsByName(like).length > 0) {
                    recentGamesContainer.innerHTML += createGameButton(like);
                }
            }
        }

        if (length > 0) {
            recentRow.appendChild(recentGamesContainer);
            gamesDiv.prepend(recentRow);
            gamesDiv.innerHTML = `<h1>Liked Games</h1>` + gamesDiv.innerHTML;
        }
    }

    //popular games
    let row = document.createElement('div');
    row.classList.add('horizontalCon');
    let gamesContainer = document.createElement('div');
    gamesContainer.classList.add('gamesCon');
    //add the arrows to the horizontal Con
    row.innerHTML += arrowContainer;

    //for each popular game, add the game to the horizontalCon

    // let popGamesRes = await fetcher(`/stats/games/popular`);

    // if (popGamesRes.status == 200) {
        // let text = await popGamesRes.text();
        // let popularGames = JSON.parse(text);

        // for (let i = 0; i < 15; i++) {
            // const gameName = popularGames[i].game;
            // if (gameName != null) {
                // gamesContainer.innerHTML += createGameButton(gameName, 'hot');
            // }
        // }
    // }
    row.appendChild(gamesContainer);
    gamesDiv.prepend(row);
    //gamesDiv.innerHTML = `<h1>Popular Games</h1>` + gamesDiv.innerHTML;

    if (newGames.length > 0) {
        let row = document.createElement('div');
        row.classList.add('horizontalCon');
        let gamesContainer = document.createElement('div');
        gamesContainer.classList.add('gamesCon');
        //add the arrows to the horizontal Con
        row.innerHTML += arrowContainer;
        //for each element in newGames, add the game to the horizontalCon
        for (let i = 0; i < newGames.length; i++) {
            gamesContainer.innerHTML += createGameButton(newGames[i]);
        }
        row.appendChild(gamesContainer);
        gamesDiv.prepend(row);
        gamesDiv.innerHTML = `<h1>New Games <a href="/classes.html?category=new">View More</a></h1>` + gamesDiv.innerHTML;
    }

    //Make new games last 3 weeks
    //UNSORT THE GAMES
    addArrowListeners();
    findLazyImages();
}

const searchBar = document.getElementById('searchBar');
var typingTimer;
var doneTypingInterval = 1000; // Time in milliseconds (1 second)

searchBar.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        let input = searchBar.value;

        zaraz.track("search", { input: input, user: token.id });
    }, doneTypingInterval);

    scrollTo(0, 0);

    let input = searchBar.value.toUpperCase().split(' ').join('');

    document.getElementById('filteredGames').style.display = 'none';
    if (input != '') {
        document.getElementById('filteredGames').style.display = '';
    }

    const gameButtons = document.getElementById('filteredGames').getElementsByClassName('all');

    let gameShown = false;
    Array.from(gameButtons).forEach((game) => {
        var name = game.getAttribute('name').toUpperCase();
        name = name.split(' ').join('');

        if (name.includes(input) && game.classList.contains(selectedTopic)) {
            game.style.display = '';
            gameShown = true;
        } else {
            game.style.display = 'none';
        }
    });
    if (!gameShown) {
        document.getElementById('noSearch').style.display = '';
    } else {
        document.getElementById('noSearch').style.display = 'none';
    }
    if (gamesDiv.innerHTML == '') {
        document.getElementById('noSearch').style.display = '';
    }
});

function createGameButton(game, pin) {
    const data = games[game];
    if (data == null) return '';
	
	game = data.name;

    //let classlist = data.tags.join(' ');
	let classlist = data.tags;//data.tags.join(' ');
	classlist = classlist.replace(/,/g, ' ');

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7 * 3);

    const gameDate = new Date(data.date_added);

    let gameBtn = '';

    let buttons = '';

    //let onclick = `location.href = 'class.html?class=${game.replaceAll(' ', '-')}'`;
    let onclick = `location.href = '/class/${game.replaceAll(' ', '-')}/'`;

    if (pin == 'pin') {
        buttons += "<button id='pin'><img src='/assets/images/icons/coloredpin.avif'></button>";
    }
    if (pin == 'hot') {
        buttons += "<button id='newbanner'><img src='/assets/images/icons/hotbanner.avif'></button>";
    }

    if (pin == 'filtered') {
        let hasCategory = false;
        for (let i = 0; i < categories.length; i++) {
			let tagslist = data.tags;//data.tags.join(' ');
			tagslist = tagslist.replace(/,/g, ' ');
			
            //if (data.tags.join(' ').includes(categories[i])) {
			if (tagslist.includes(categories[i])) {
                hasCategory = true;
            }
        }
        if (!hasCategory) {
            classlist += ' random';
        }
    }

    if (gameDate > weekAgo) {
        classlist += ' new';
        buttons += "<button id='newbanner'><img src='/assets/images/icons/newbanner.avif'></button>";
    }

    if (pin != 'suggested') {
        classlist += ' all';
    }

    if (pin != 'hidden' && pin != 'filtered') {
        gameBtn = `
        <div name="${game}" id="gameDiv" onclick="${onclick}" class="${classlist}">
            ${buttons}
            <div class="imageCon">
                <img class="lazy" data-src="${data.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='100%25' height='100%25' fill='%23340060'/%3E%3C/svg%3E" alt="Totally Science ${game}" title="Totally Science ${game}"/>
            </div>
            <h1 class="innerGameDiv">${game}</h1>
        </div>
        `;
    } else {
        gameBtn = `
        <div name="${game}" id="gameDiv" style="display: none;" onclick="${onclick}" class="${classlist}">
            ${buttons}
            <div class="imageCon">
                <img class="lazy" data-src="${data.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='100%25' height='100%25' fill='%23340060'/%3E%3C/svg%3E" alt="Totally Science ${game}" title="Totally Science ${game}"/>
            </div>
            <h1 class="innerGameDiv">${game}</h1>
        </div>
        `;
    }

    return gameBtn;
}

function addArrowListeners() {
    for (let i = 0; i < document.getElementsByClassName('arrowLeftCon').length; i++) {
        document.getElementsByClassName('arrowLeftCon')[i].addEventListener('click', function(e) {
            const parentElement = e.target.parentNode.parentNode;
            const gamesCon = parentElement.querySelectorAll('.gamesCon')[0];

            // gamesCon.scrollLeft -= 1100;
            gamesCon.scrollLeft -= Math.min(gamesCon.scrollLeft, 1100);
        });
    }

    for (let i = 0; i < document.getElementsByClassName('arrowRightCon').length; i++) {
        document.getElementsByClassName('arrowRightCon')[i].addEventListener('click', function(e) {
            const parentElement = e.target.parentNode.parentNode;
            const gamesCon = parentElement.querySelectorAll('.gamesCon')[0];

            const leftArrow = e.target.parentNode.parentNode.querySelectorAll('.arrowCon')[0];
            leftArrow.style += 'visibility: visible';

            // gamesCon.scrollLeft += 1100;
            const remainingSpace = gamesCon.scrollWidth - gamesCon.clientWidth - gamesCon.scrollLeft;
            gamesCon.scrollLeft += Math.min(remainingSpace, 1100);
        });
    }
}

function findLazyImages() {
    // Get all the lazy images
    const lazyImages = document.querySelectorAll('.lazy');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.src = entry.target.dataset.src;
                    entry.target.classList.remove('lazy');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // Start loading the images when they are 10% visible
            threshold: 0.1,

            // Start loading the images when they are 500 pixels away from the viewport
            rootMargin: '500px 0px',
        }
    );

    lazyImages.forEach((image) => {
        observer.observe(image);
    });
}