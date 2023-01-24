const signUp = document.querySelector(".signUp");
const logIn = document.querySelector(".logIn");
const signUpButton = document.querySelector(".signUp__button");
const logInButton = document.querySelector(".logIn__button");
const signUpPageButton = document.querySelector(".signUp__logInButton");
const logInPageButton = document.querySelector(".logIn__SignUpButton");

const emailSignUp = document.querySelector(".signUp__email");
const nameSignUp = document.querySelector(".signUp__name");
const passwordSignUp = document.querySelector(".signUp__password");

const emailLogIn = document.querySelector(".logIn__email");
const passwordLogIn = document.querySelector(".logIn__password");



const loader = document.querySelector(".loader"); 
loader.classList.add("empty");

//смена signUp и logIn
signUpPageButton.addEventListener("click", ()=>{
    signUp.classList.add("signUp-unactive");
    logIn.classList.remove("logIn-unactive");
})
logInPageButton.addEventListener("click", ()=>{
    logIn.classList.add("logIn-unactive");
    signUp.classList.remove("signUp-unactive");
})

signUpButton.addEventListener("click", ()=>{
    console.log("singUp")
    const email = emailSignUp.value;
    const name = nameSignUp.value;
    const pass = passwordSignUp.value;
    console.log(email, name, pass)

})

logInButton.addEventListener("click", ()=>{
    const email = emailLogIn.value;
    const pass = passwordLogIn.value;
    console.log(email, pass)

})



