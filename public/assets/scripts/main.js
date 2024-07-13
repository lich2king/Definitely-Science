// establish which server to connect to, depending on if hosted locally or live online
const liveServer = '/api';
const localServer = 'http://localhost:5003';
const activeServer = location.host.startsWith('localhost') || location.host.startsWith('127.0.0.1') ? localServer : liveServer;

/**
 * Adds certain header and sends a request
 * 'Content-Type': 'application/json' is added to the headers
 * the method is set to POST if body passed into options
 * the body is passed into JSON.stringify()
 * @param {string} endpoint - a url endpoint to be fetched. Formatted like http://example.com/ or https://example.com/
 * @param {object} options - Can be any traditional fetch options provided an object. method and body are commonly used
 */
function fetcher(endpoint, options) {
	return true;
    // let updatedOptions = {...options };

    // updatedOptions.headers = {
        // ...(options ? options.headers : null),
        // 'Content-Type': 'application/json',
    // };

    // updatedOptions.credentials = 'include';

    // if (options && options.hasOwnProperty('body')) {
        // // switch from GET to POST
        // updatedOptions.method = 'POST';

        // // json stringify body
        // updatedOptions.body = JSON.stringify({
            // ...(options ? options.body : null),
        // });
    // }

    // //add active server when using node version
    // return fetch(`${activeServer}${endpoint}`, updatedOptions);
}
/**
 * takes and integer and ads M or K suffix if it is above 1,000 or 1,000,000
 * @param {integer} num - an integer to be formatted
 */
function numFormatter(num) {
    if (num < 0) {
        return 0;
    }
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
    } else if (num < 1000) {
        return num; // if value < 1000, nothing to do
    }
}

/**
 * randomly selects a property of an object
 * @param {object} object - an object to select a random property of
 */
function randomProperty(object) {
    let keys = Object.keys(object);
    return keys[Math.floor(keys.length * Math.random())];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function counter(id, start, end, duration) {
    // increase the points counter over time
    const obj = document.getElementById(id);
    const range = end - start;

    if (range == 0) return;

    const increment = end > start ? 1 : -1;
    const step = Math.abs(Math.floor(duration / range));

    let current = start;

    let timer = setInterval(() => {
        current += increment;

        obj.textContent = current;

        if (current == end) {
            clearInterval(timer);
        }
    }, step);
}

// init user prefs
if (localStorage.getItem('website') == null) localStorage.setItem('website', 'https://classroom.google.com/');

// update favicon and title with user disguise
if (localStorage.getItem('disguise') == null) {
    localStorage.setItem('disguise', 'none');
} else {
    const disguise = localStorage.getItem('disguise');
    const favicon = document.querySelector('[rel=icon]');
    const title = document.querySelector('title');

    if (disguise == 'gc') {
        title.innerHTML = 'Google Classroom';
        favicon.href = '/assets/images/disguises/gcicon.png';
    } else if (disguise == 'gd') {
        title.innerHTML = 'Google Docs';
        favicon.href = '/assets/images/disguises/gdicon.png';
    } else if (disguise == 'canvas') {
        title.innerHTML = 'Dashboard';
        favicon.href = '/assets/images/disguises/canvasicon.jpg';
    } else if (disguise == 'g') {
        title.innerHTML = 'Google';
        favicon.href = '/assets/images/disguises/googleicon.png';
    } else if (disguise == 'calc') {
        title.innerHTML = 'Calculator';
        favicon.href = '/assets/images/disguises/calculator.png';
    } else if (disguise == 'wiki') {
        title.innerHTML = 'Wikipedia';
        favicon.href = '/assets/images/disguises/wikipedia.png';
    }
}

// redirect to mobile site
// may want to switch this to cloudflare redirect feature in the future
var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
if (typeof screen.orientation !== 'undefined' || isMac) {
    //not mobile
} else {
    //mobile
    window.open('/mobile/index.php', '_self');
}

// panic button
window.addEventListener(
    'keydown',
    (e) => {
        if (e.key == '`') window.open(localStorage.getItem('website'), '_blank');
        else if (e.key == '[') aboutInBlank();
    },
    false
);

// page load init
window.addEventListener('load', () => {
    // register service worker
    //if ('serviceWorker' in navigator) {
    //    navigator.serviceWorker.register('sw.js');
    //}
});

// update points in navbar
// async function setPointsDisplay(numPoints, username) {
//     document.getElementById('pointsDisplay').innerText = numPoints;

//     // this is only called if user is logged in, also display the user's mini
//     let userMiniRes = await fetcher(`/profile/userdata/${username}`);
//     let userMiniJson = await userMiniRes.json();

//     document.getElementById('login').innerHTML = `<img src="assets/minis/JPGs/${userMiniJson.activeMini}.avif">`;
// }

async function logout() {
    await fetcher(`/auth/logout`);

    location.reload();
}

function aboutInBlank() {
    let url = location.href;

    maskedWindow = window.open();

    const doc = maskedWindow.document;
    doc.title = '';

    let embed = doc.createElement('embed');

    if (url.includes('https://') || url.includes('http://')) {
        embed.src = url;
    } else {
        embed.src = 'https://' + url;
    }

    embed.width = '100%';
    embed.height = '100%';
    embed.style.position = 'fixed';
    embed.style.top = '0';
    embed.style.left = '0';

    let script = document.createElement('script');

    script.innerHTML = `
        window.onbeforeunload = function() {
            return "reloading the site will end the aboutblank session. Are you sure you want to continue?";
        };
    `;

    doc.body.appendChild(embed);
    doc.body.appendChild(script);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function message(msg)
{
    let msgEle = document.createElement('div');
    msgEle.className = 'message';
    msgEle.innerText = msg;

    document.body.appendChild(msgEle);

    setTimeout(() => {
        document.body.removeChild(msgEle);
    }, 3000);
}
