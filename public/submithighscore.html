<!DOCTYPE html>
<html lang="en">

<head>
    <title>Submit Highscore - Totally Science - Free Online Unblocked Games</title>
    <?php include "assets/includes/head.php" ?>



    <style>
    #gameInfo {
        margin-top: 120px;
        width: 100vw;
        text-align: center;
        margin-bottom: 40vh;
    }

    #gameInfo p {
        color: var(--light-color);
        font-size: 1.25vw;
        font-family: 'Rubik';
    }

    #save-button {
        padding: 15px;
        font-size: 1.25vw;
    }
    </style>
</head>

<body>
    <?php include "assets/includes/navbar.php" ?>

    <div id="gameInfo">
        <p>What game is it for?</p>
        <select name="gamesSelect" id="gamesSelect">
        </select>

        <p>What is your score?</p>
        <input type="text" id="scoreText" placeholder="100">

        <p>Submit a screenshot of your score (Show full screen including top website bar otherwise INVALID)</p>
        <input type="file" id="fileUpload">

        <br><br>

        <button class="button" id="save-button" onclick="SubmitHighscore()">Submit</button>
        <p style="text-align: center; color: red;" id="errorText"></p>
    </div>

    <?php include "assets/includes/footer.php" ?>

    <script>
        window.addEventListener('load', async () => {
            let response = await fetcher(`/auth/check`);

            if (response.status == 401 || response.status == 403) {
                location.href = 'signup.php';
            } else {
                // display points count in navbar
                let json = await response.json();
                setPointsDisplay(json.points || 0, json.username || "");
            }
        });

        let image;

        window.addEventListener('load', async () => {
            // load games onto dropdown menu
            let gamesRes = await fetcher('/games');
            let retrivedGames = await gamesRes.json();

            const gamesSelect = document.getElementById('gamesSelect');

            for (const [name] of Object.entries(retrivedGames)) {
                const gameOp = document.createElement('option');

                gameOp.value = name;
                gameOp.innerHTML = name;

                gamesSelect.appendChild(gameOp);
            }

            // handle file input
            document.querySelector('input[type="file"]').addEventListener('change', (e) => {
                const errorText = document.getElementById('errorText');
                errorText.innerHTML = '';
                errorText.style.color = 'red';

                if (!e.target.files || !e.target.files[0]) {
                    return;
                }

                const file = e.target.files[0]
                const fileType = file['type'];
                const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];

                if (!validImageTypes.includes(fileType)) {
                    errorText.innerText = "You can only upload an image.";

                    document.querySelector('input[type="file"]').value = null;

                    return;
                } else if (file.size > 1000000) {
                    errorText.innerText = "The file must be smaller than 10mb.";

                    document.querySelector('input[type="file"]').value = null;

                    return;
                }

                let reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = () => {
                    image = reader.result;
                };

                reader.onerror = (error) => {
                    console.log('error: ', error);
                };
            });
        });

        async function SubmitHighscore() {
            const gameName = document.getElementById('gamesSelect').value;
            const score = document.getElementById('scoreText').value;

            const errorText = document.getElementById('errorText');
            errorText.innerHTML = '';
            errorText.style.color = 'red';

            let submitRes = await fetcher(`/profile/highscores/submit`, {
                body: {
                    gameName: gameName,
                    score: score,
                    image: image
                }
            });

            if (submitRes.status == 422) {
                let text = await submitRes.text();

                errorText.innerText = text;
            } else {
                errorText.style.color = 'green';
                errorText.innerHTML = 'Success! Your score will be reviewed shortly.';

                setTimeout(() => {
                    location.href = 'leaderboard.php';
                }, 1000);
            }
        }
    </script>
</body>

</html>