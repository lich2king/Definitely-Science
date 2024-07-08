<!DOCTYPE html>
<html lang="en">

<head>
    <title>Leaderboard - Definitely Science - Free Online Unblocked Games</title>
	<!--<link rel="canonical" href="https://definitelyscience.com/" />-->
	
	<script type="text/javascript">
	  window.location.href = '/';
	</script>
	
    <?php include "assets/includes/head.php" ?>


    <style>
    #searchDiv {
        margin-top: 80px;
        text-align: center;
        height: 50px;
        position: sticky;
        z-index: 12;
        padding-top: 10px;
        margin-bottom: 10px;
        background-color: var(--background-color);
        top: 60px;
    }

    #submitB {
        position: relative;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 50px;
        z-index: 5;
    }

    input[type='text'] {
        width: 20vw;
        height: 5vh;
        box-sizing: border-box;
        border: transparent;
        border-radius: 17px;
        font-size: 16px;
        background-color: var(--light-color);
        outline: none;
        background-image: url('https://img.icons8.com/material-outlined/24/000000/search--v1.png');
        background-size: 1.25vw;
        background-position: 10px calc(50%);
        background-repeat: no-repeat;
        padding: 1vh 1vw 1vh 2.2vw;
        transition: width 0.4s ease-in-out;
        margin-bottom: 3%;
        color: var(--dark-color);
    }

    #highscores {
        margin-top: 80px;
        width: 100vw;
        margin-bottom: 20vh;
    }

    #highscore {
        position: relative;
        z-index: 3;
        background-color: var(--accent-color);
        margin: auto;
        border-radius: 30px;
        width: 70vw;
        max-width: 450px;
        height: 140px;
        margin-bottom: 5vh;
        transition: 0.1s;
        overflow: hidden;
    }

    #highscore:hover {
        cursor: pointer;
        transform: scale(1.025);
    }

    #highscore .text {
        width: 50%;
        margin-right: 8%;
        height: 100%;
        float: right;
        padding: 1vh 0;
    }

    #highscore h1,
    p,
    h3 {
        white-space: nowrap;
        color: var(--light-color);
        font-family: 'Rubik';
        margin: 7px;
    }

    #highscore p {
        vertical-align: middle;
        
    }
    #highscore p img {
        width: 25px;
        border-radius: 8px;
        vertical-align: middle;
    }
    #highscore h1 svg {
        vertical-align: middle;
    }
    #highscore h1 span {
        vertical-align: middle;
    }

    #highbcore h3 {
        text-shadow: var(--dark-color) 1px 0 10px;
    }

    #highscore .image {
        width: 40%;
        height: 100%;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #highscore .image div {
        border-radius: 30px;
        height: 80%;
        width: 100%;
        margin-left: 10px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    #nohighscore {
        margin-top: 60px;
        text-align: center;
        color: var(--light-color);
        font-family: 'Rubik';
    }

    #verticalAds {
        position: fixed;
        z-index: 2;
        top: 0px;
        height: 100vh;
        width: 100vw;
        display: flex;
        flex: 1;
        align-items: center;
        justify-items: center;
        margin-top: 50px;
    }

    #verticalAds .contain-left {
        display: flex;
        flex: 1;
        align-content: flex-start;
        justify-content: flex-start;
    }

    #verticalAds .contain-right {
        display: flex;
        flex: 1;
        align-content: flex-end;
        justify-content: flex-end;
    }

    .left {
        position: relative;
        z-index: 11;
        margin-left: 15%;
        width: 15vw;
        height: 80vh;
    }

    .right {
        position: relative;
        z-index: 11;
        margin-right: 15%;
        width: 15vw;
        height: 80vh;
    }
    </style>
</head>

<body>
    <?php include "assets/includes/navbar.php" ?>

    <div id="top"></div>

    <div id="searchDiv">
        <input type="text" name="search" value="" autocomplete="off" id="searchBar" placeholder="Search by game">
    </div>

    <h1 id="nohighscore" style="display:none"></h1>

    <div id="highscores">
        <div id="submitB">
            <button class="button" onclick="window.open('submithighscore.php', '_self')"><span>Submit Highscore</span>
                <img style="padding-left:0.5vw" width="16vw" src="assets/images/icons/arrow-right-white.svg">
            </button>
        </div>
    </div>

    <?php include "assets/includes/footer.php" ?>

    <script>
    window.addEventListener('load', async () => {
        const searchBar = document.getElementById('searchBar');
        const scoresDiv = document.getElementById('highscores');
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const gameName = urlParams.get('class');

        let response = await fetcher(`/auth/check`);
        if (response.status == 200) {
            // display points count in navbar
            let json = await response.json();
            setPointsDisplay(json.points || 0, json.username || "");
        }

        // update link in navbar
        document.getElementById("leaderboardnav").classList.add("selected");

        // fetch list of highscores
        let highscoresRes = await fetcher(`/profile/highscores/view`);
        let text = await highscoresRes.text();
        let highscores = JSON.parse(text);

        let gamesRes = await fetch(`assets/games.json`);
        let games = await gamesRes.json();

        for (score in highscores) {
            const game = highscores[score].game;
            const name = highscores[score].name;
            const gameScore = highscores[score].score;
            if (game != null) {
                let userMiniRes = await fetcher(`/profile/userdata/${name}`);
                let userMiniJson = await userMiniRes.json();

                const highscoreDiv = `
                        <div class="highscore" name="${game}" id="highscore" onclick="location.href = 'class.php?class=${game.replaceAll(' ', '-')}'">
                            <div class="image">
                                <div style="background-image: url('${games[game].image}');"></div>
                            </div>

                            <div class="text">
                                <h1>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFD700" class="bi bi-trophy-fill" viewBox="0 0 16 16">
                                        <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"/>
                                    </svg>

                                    <span>${game}</span>
                                </h1>

                                <h3>${gameScore}</h3>

                                <p>
                                    <img src="assets/minis/JPGs/${userMiniJson.activeMini}.avif">
                                    ${name}
                                </p>
                            </div>
                        </div>
                    `;

                scoresDiv.innerHTML += highscoreDiv;
            }
        }

        if (gameName) {
            let highscored = false;

            for (score in highscores) {
                const game = highscores[score].game;

                if (game == gameName) highscored = true;
            }
            if (highscored) {
                document.getElementsByName(`${gameName}`)[0].scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest"
                });
            } else {
                document.getElementById("nohighscore").style.display = '';
                document.getElementById("nohighscore").innerText =
                    `No current highscore set for ${gameName}`;
            }
        }


        searchBar.addEventListener('keyup', () => {
            document.getElementById('top').scrollIntoView({
                block: "start",
                inline: "nearest"
            });

            const input = searchBar.value.toUpperCase();
            const highscoreDivs = document.getElementsByClassName("highscore");

            for (highscore in highscoreDivs) {
                if (highscoreDivs[highscore].getAttribute('name').toUpperCase().includes(input))
                    highscoreDivs[highscore].setAttribute('style', 'display:');
                else highscoreDivs[highscore].setAttribute('style', 'display:none');
            }
        });
    });
    </script>
</body>

</html>