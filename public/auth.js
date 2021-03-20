// const user = false;
// listen for auth status changes
auth.onAuthStateChanged(user => {
    console.log(user);
    if(user){
        console.log('user logged in: ', user);
        document.getElementById("user").value = "Logged in";
        user = true;

    }
    else{
        console.log('user logged out');
    }
});

// export {user};

//signup

window.onload = function(){
    const signupForm = document.querySelector('#signup-form');
    if(signupForm){
        signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;


    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user);
        signupForm.reset();
    })
});
    }




const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("User signed out");
    })
});


// login
const loginForm = document.querySelector("#login-form");
if(loginForm){
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // get user info
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            console.log(cred.user);
            loginForm.reset();
        })

    })
}
}

