<!DOCTYPE html>
<html lang="en">

<head>
    <?php include "assets/includes/head.php" ?>

    <link rel='stylesheet' href='./assets/styles/account.css'>
</head>

<body>
    <?php include "assets/includes/navbar.php" ?>

    <form id="survey" action="javascript:changePassword()">
        <div id="div">
            <label for="password">Current Passowrd</label><br>
            <input type='password' id='currentPassword' name='password' placeholder='**********'><br>
        </div>

        <div id="div2">
            <label for="password">New Password</label><br>
            <input type='password' id='password' name='password' placeholder='**********'><br>
        </div>

        <div id="div1">
            <label for="password">Confirm New Password</label><br>
            <input type='password' id='confirmPassword' name='password' placeholder='**********'><br>
        </div>

        <button class="button" id="save-button">Submit</button>
        <br>
        <a href="profile.php" id="back-login">Back to login</a>
    </form>

    <p style="text-align: center; color: red;" id="errorText"></p>
</body>

<?php include "assets/includes/footer.php" ?>

<script>
    window.addEventListener('load', async () => {
        let response = await fetcher(`/auth/check`);

        if (response.status == 401 || response.status == 403) {
            location.assign('/signup.php');
        } else {
            document.getElementById('back-login').innerText = 'Back to profile';

            // display points count in navbar
            let json = await response.json();
            setPointsDisplay(json.points || 0, json.username || "");
        }
    });

    async function changePassword() {
        const confirmPassword = document.getElementById('confirmPassword').value;
        const currentPassword = document.getElementById('currentPassword').value;
        const password = document.getElementById('password').value;
        const error = document.getElementById('errorText');

        let res = await fetcher(`/auth/change/password`, { body: { confirm_password: confirmPassword, password: password, current_password: currentPassword } });
        let text = await res.text();

        if (res.status == 200) {
            // display success message to user
            error.style.color = 'green';
            error.innerText = 'success';

            setTimeout(() => {
                location.href = 'profile.php';
            }, 500);
        } else if (res.status == 422) {
            error.innerText = text;
        }
    }
</script>

</html>