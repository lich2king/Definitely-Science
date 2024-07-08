const websiteInput = $('website')
const themeInput = $('theme')
const saveBtn = $('save-button')

websiteInput.value = localStorage.getItem('mobwebsite')
themeInput.value = localStorage.getItem('theme')

$('survey').addEventListener('submit', (e) => {
    e.preventDefault();

    let websiteEntered = websiteInput.value
    let themeEntered = themeInput.value

    localStorage.setItem("mobwebsite", websiteEntered)
    localStorage.setItem("theme", themeEntered)

    saveBtn.innerHTML = "Saved."
    setTimeout(() => {
        saveBtn.innerHTML = "Save"
    }, 500)
})

document.getElementById('alertIcon').src = `../assets/images/exclamation-${localStorage.getItem("theme")}.svg`
document.getElementById('backarrowLogo').src = `../assets/images/backarrow-${localStorage.getItem("theme")}.svg`