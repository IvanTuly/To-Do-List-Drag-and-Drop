const navBar = document.querySelector("nav"),
    menuBtns = document.querySelectorAll(".mainmenu-icon"),
    overlay = document.querySelector(".overlay");
let colorScheme = "red";
let colorText = "white";

var settings = {
    colorScheme: colorScheme,
    colorText: colorText
}

if (localStorage.getItem('settings')) {
    //парсим JSON и записываем в массив tasks
    settings = JSON.parse(localStorage.getItem('settings'));
}

console.log(settings)
document.documentElement.style.setProperty('--main-color-scheme', settings.colorScheme);
document.documentElement.style.setProperty('--main-text-scheme', settings.colorText);

//открытие и закрытие меню
menuBtns.forEach((menuBtn) => {
    menuBtn.addEventListener("click", () => {
        navBar.classList.toggle("open");
        const logInButton = document.querySelector(".button_previousWeek");
        logInButton.classList.add("empty")
    });
});
overlay.addEventListener("click", () => {
    navBar.classList.remove("open");
    const logInButton = document.querySelector(".button_previousWeek");
    logInButton.classList.remove("empty")
});
document.querySelector(".openmenu-icon").addEventListener("click", () => {
    navBar.classList.remove("open");
    const logInButton = document.querySelector(".button_previousWeek");
    logInButton.classList.remove("empty")
})


//переключение цвета по кнопкам
document.querySelector(".colorButton__colorRed").addEventListener("click", () => {
    document.documentElement.style.setProperty('--main-color-scheme', 'red');
    document.documentElement.style.setProperty('--main-text-scheme', 'white');
    settings.colorScheme = "red"
    settings.colorText = "white"
    saveToLocalStorage()
})
document.querySelector(".colorButton__colorBlack").addEventListener("click", () => {
    document.documentElement.style.setProperty('--main-color-scheme', 'black');
    document.documentElement.style.setProperty('--main-text-scheme', 'white');
    settings.colorScheme = "black"
    settings.colorText = "white"
    saveToLocalStorage()
})
document.querySelector(".colorButton__colorGreen").addEventListener("click", () => {
    document.documentElement.style.setProperty('--main-color-scheme', 'green');
    document.documentElement.style.setProperty('--main-text-scheme', 'white');
    settings.colorScheme = "green"
    settings.colorText = "white"
    saveToLocalStorage()
})
document.querySelector(".colorButton__colorBlue").addEventListener("click", () => {
    document.documentElement.style.setProperty('--main-color-scheme', 'blue');
    document.documentElement.style.setProperty('--main-text-scheme', 'white');
    settings.colorScheme = "blue"
    settings.colorText = "white"
    saveToLocalStorage()
})
document.querySelector(".colorButton__colorYellow").addEventListener("click", () => {
    document.documentElement.style.setProperty('--main-color-scheme', 'yellow');
    document.documentElement.style.setProperty('--main-text-scheme', 'black');
    settings.colorScheme = "yellow"
    settings.colorText = "black"
    saveToLocalStorage()
})
document.querySelector(".colorButton__colorPink").addEventListener("click", () => {
    document.documentElement.style.setProperty('--main-color-scheme', 'pink');
    document.documentElement.style.setProperty('--main-text-scheme', 'white');
    settings.colorScheme = "pink"
    settings.colorText = "white";
    saveToLocalStorage()
})
document.querySelector(".colorButton__colorPurple").addEventListener("click", () => {
    document.documentElement.style.setProperty('--main-color-scheme', 'purple');
    document.documentElement.style.setProperty('--main-text-scheme', 'white');
    settings.colorScheme = "purple"
    settings.colorText = "white";
    saveToLocalStorage()
})


function saveToLocalStorage() {
    localStorage.setItem('settings', JSON.stringify(settings));
}

//   const range = document.querySelector('.textSizeSlider')
//   const content = document.querySelector(".sizeChange__example")
//   const tasksContent = document.querySelector(".text")
//   range.addEventListener('input', ()=>{
//     const rangeValue = range.value;
//     content.style.fontSize = rangeValue + "px"
//     tasksContent.style.fontSize = rangeValue + "px"
//   })
