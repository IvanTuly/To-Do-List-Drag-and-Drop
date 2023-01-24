// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getStorage, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
        apiKey: "AIzaSyBZ72eZTCZOP2oz0Em3FMQT9LDh-mnVdfk",
        authDomain: "to-do-drag-and-drop.firebaseapp.com",
        projectId: "to-do-drag-and-drop",
        storageBucket: "to-do-drag-and-drop.appspot.com",
        messagingSenderId: "836907883873",
        appId: "1:836907883873:web:9ef6228bb59aceb388f920",
        databaseURL: "https://to-do-drag-and-drop-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
var app = initializeApp(firebaseConfig);
var auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app);
console.log(storage);

var uid = ''




// Create a storage reference from our storage service
// const storageRef = ref(storage);
// const fileName = "test.json"
// const spaceRef = ref(storageRef, fileName);
// console.log(spaceRef);

// //как только страница загрузится
// window.addEventListener('load', () => {
//         console.log("page is fully loaded");

const signUpButton = document.querySelector(".signUp__button")
//registration
if (signUpButton != null) {
        signUpButton.addEventListener("click", () => {

                const email = document.querySelector(".signUp__email").value;
                const pass = document.querySelector(".signUp__password").value;

                const errorMessageNode = document.querySelector(".signUp__errorMessage");
                errorMessageNode.classList.add("empty")

                if (email != "" && pass != ""){
                        //for new registratiom
                        createUserWithEmailAndPassword(auth, email, pass)
                        .then((userCredential) => {
                                //signed in
                                const user = userCredential.user;
                                console.log(user);

                                //массив с задачами и их статусом 
                                let tasks = [];
                                
                                if (localStorage.getItem('tasks')) {
                                        //парсим JSON и записываем в массив tasks
                                        tasks = JSON.parse(localStorage.getItem('tasks'));
                                    }
                                
                                
                                console.log(tasks)
                                saveToFirebase(tasks);
                        

                                window.location.href = '../../index.html';      
                        })
                        .catch((error) => {
                                errorMessageNode.classList.remove("empty")
                                const errorCode = error.code;
                                const errorMessage = error.message;

                                console.log(errorMessage);
                                errorMessageNode.innerText = errorCode.slice(5);
                        });
                } else{
                        errorMessageNode.classList.remove("empty")
                        errorMessageNode.innerText = "Enter email and password";
                }

        });
}

const logInButton = document.querySelector(".logIn__button")
//login
if (logInButton != null) {
        document.querySelector(".logIn__button").addEventListener("click", () => {
                const email = document.querySelector(".logIn__email").value;
                const pass = document.querySelector(".logIn__password").value;
                const errorMessageNode = document.querySelector(".logIn__errorMessage");
                errorMessageNode.classList.add("empty")

                if (email != "" && pass != ""){
                        const loader = document.querySelector(".loader"); 
                        loader.classList.remove("empty");
        

        
                        signInWithEmailAndPassword(auth, email, pass)
                                .then((userCredential) => {
                                        const user = userCredential.user;
                                        
                                        setTimeout(function(){
                                                window.location.href = '../../index.html';
                                              }, 2 * 1000);
                                        
                                             
                                        
                                        
                                }).catch((error) => {
                                        errorMessageNode.classList.remove("empty")
        
                                        const errorCode = error.code;
                                        const errorMessage = error.message;
                                        loader.classList.add("empty");
        
                                        errorMessageNode.innerText = errorCode.slice(5);
                                        console.log(errorMessage, errorCode);
                                        // alert(errorMessage);
                                })
                } else {
                        errorMessageNode.classList.remove("empty")
                        errorMessageNode.innerText = "Enter email and password";
                }
        });
};

const passwordReset = document.querySelector(".logIn__forgotPassButton");
//reset password
if (passwordReset != null){
        document.querySelector(".logIn__forgotPassButton").addEventListener("click", () => { 
                
                const email = document.querySelector(".logIn__email").value;
                sendPasswordResetEmail(auth, email)
                .then(() => {
                        // Password reset email sent!
                        alert("password reset link send")
                })
                .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                alert("invalid email")
                }); 
        }) 
}


export function logOut(){
        signOut(auth).then(() => {
                alert("logOut success")
                uid=""
                // Sign-out successful.
        }).catch((error) => {
                // An error happened.
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(errorMessage);
                alert(errorMessage);

        });
}
//logOut


// });

//проверка на уже зашедшего пользователя
onAuthStateChanged(auth, (user) => {
        if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                uid = user.uid;
                console.log(user.email)
                getFileFromFirebase(uid)

                // ...
        } else {
                // User is signed out
                // ...
        }
});



export function saveToFirebase(tasks) {
        if (uid != ""){
                set(ref(db, 'users/' + uid), {
                        tasks
                      })
                      .then(()=>{
                        console.log("data stored successfully")
                      })
                      .catch((error)=>{
                        console.log("error"+error)
                      })
        } else {
                console.log("to store your data you need log in");
        }
}




export function getFileFromFirebase(userUID) {
        console.log("User UID = " + userUID)
        var tasksFromFirebase


                        // User is signed in, see docs for a list of available properties
                        // https://firebase.google.com/docs/reference/js/firebase.User
                        
                        

                        const dbRef = ref(getDatabase());
                        get(child(dbRef, `users/${userUID}/tasks`)).then((snapshot) => {
                                console.log("get запрос ")
                          if (snapshot.exists()) {
                                console.log("данные из firebase");
                                console.log(snapshot.val());
                                tasksFromFirebase = snapshot.val();
                                localStorage.setItem('tasks', JSON.stringify(tasksFromFirebase));

                                
                                
                          } else {
                            console.log("No data available");
                            localStorage.removeItem('tasks');
                          }
                        }).catch((error) => {
                                tasksFromFirebase = "Can't do it"
                          console.error(error);
                        });

                        // ...
                
        
}











