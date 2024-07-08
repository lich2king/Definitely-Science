<!DOCTYPE html>
<html lang="en">

<head>
    <!-- mobile main css is inherited from this -->
    <?php include "../assets/includes/head.php" ?>

    <style>
    :root {
        --doc-height: 100%;
    }

    iframe {
        width: 100vw;
        height: 100vh;
        /* fallback for Js load */
        height: var(--doc-height);
        position: absolute;
        top: 0;
        left: 0;
    }

    body {
        background-color: black;
        background-image: url('../background.svg');
        background-repeat: no-repeat;
        background-attachment: fixed;
    }

    html {
        overflow: hidden;
    }

    #gameFixedElements {
        min-width: 60px;
        max-width: 60px;
        max-height: 40px;
        min-height: 40px;
        background-color: var(--accent-color);
        display: flex;
        flex-direction: column;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        overflow: hidden;
        position: absolute;
        top: 2vh;
        left: -10px;
        z-index: 100;
        border: none;
        align-items: center;
        justify-content: center;
    }

    #gameFixedElements.exc {
        margin-top: 50px;
    }

    #gameFixedElements img {
        width: 20px;
        height: 20px;
    }
    </style>
</head>

<body>
    <button id="gameFixedElements" onclick="window.open('index.php', '_self')">
        <img id="backarrowLogo" src="assets/backarrowwhite.svg">
    </button>
    <button id="gameFixedElements" class="exc" onclick="window.open('https:/\/google.com', '_blank')">
        <img id="alertIcon" src="assets/exclamationwhite.svg">
    </button>


    <iframe src="" width="80vw" height="80vh" overflow="visible" frameBorder="0" id="game-iframe"></iframe>

    <script src="assets/scripts/main.js?v65"></script>
    <script>
    // if (window.innerHeight > window.innerWidth) {
    //     alert("Please use Landscape!");
    // }

    const documentHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
    }
    window.addEventListener('resize', documentHeight);
    documentHeight();


    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameName = urlParams.get('class');

    fetch(`../assets/games.json?date=${new Date().getTime()}`).then((response) => response.json()).then((games) => {
        const gameData = games[gameName];

        if (gameData == null) window.location.href = 'index.php';

        // update game view statistics
        fetch(`/stats/games/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                gameName: gameName
            }
        });

        var theIframeUrl = gameData.iframe_url;
        if (theIframeUrl[0] == '.' || theIframeUrl[0] == '/' || theIframeUrl[0] == 'a') {
            theIframeUrl = `../${theIframeUrl}`;
        }
        $('game-iframe').src = theIframeUrl;
    });
    </script>
</body>

</html>