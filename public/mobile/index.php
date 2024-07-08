<!-- // READY -->

<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "../assets/includes/head.php" ?>
    <link rel='stylesheet' href='assets/styles/main.css?v58'>
</head>

<body>


    <section id="searchBarSection" style="display:none;">
        <div class="search-bar" style="margin-top: 25px" align="center">
            <input type="text" name="search" value="" onfocusout="noSearch()" autocomplete="off" id="searchBar"
                placeholder="Search">
        </div>
    </section>


    <div id="games">
        <!-- <div id="gameOffset"></div> -->
        <div id="fixedElements">
            <div class="top">
                <img src="../assets/images/transparentlogo.png"></img>
                <div class="text">
                    <p>Totally</p>
                    <p>Science</p>
                </div>
            </div>
            <!-- <div class="horizontalmidline"></div> -->
            <div class="bottom">
                <button onclick="openSchoolSite()" id="alert"><img id="alertIcon" src="assets/exclamation.svg"></button>
                <div class="verticalmidline"></div>
                <button onclick="search()" id="backarrow"><img id="backarrowLogo" src="assets/magnifying.svg"></button>
            </div>
        </div>
    </div>

    <script src="assets/scripts/main.js?v69"></script>
    <script src="assets/scripts/mobile.js?v71"></script>
</body>

</html>