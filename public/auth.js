// listen for auth status changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user logged in: ", user);
    document.getElementById("user").value = "Logged in";
  } else {
    console.log("user logged out");
  }
});

//signup

window.onload = function () {
  const signupForm = document.querySelector("#signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // get user info
      const newUsername = signupForm["signup-username"].value;
      const email = signupForm["signup-email"].value;
      const password = signupForm["signup-password"].value;

      const usersRef = database.ref("Users");
      var currentArray = [];

      usersRef
        .once("value", (snap) =>
          snap.forEach((user) => {
            console.log(user.val().username);
            var newUser = user.val().username;

            currentArray.push(newUser.toLowerCase());
          })
        )
        .then(function onSuccess(res) {
          console.log(currentArray);
          console.log(newUsername);
          if (currentArray.includes(newUsername.toLowerCase())) {
            console.log("true");
            alert("Username already used");
            done = true;
          } else {
            console.log("false");
            auth
              .createUserWithEmailAndPassword(email, password)
              .then((cred) => {
                console.log(cred.user);
                console.log(cred.user.uid);
                const userID = cred.user.uid;

                database.ref(`Users/${userID}`).set({
                  username: newUsername,
                });
                signupForm.reset();
                window.location.href = "/";
              })
              .catch(function (error) {
                // Handle Errors here

                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("user did not sign up correctly");
                console.log(errorCode);
                console.log(errorMessage);
                alert(errorMessage);
              });
          }
        })
        .catch(function onError(err) {
          console.log(err);
          // do sth
        });
    });
  }

  // logout
  const logout = document.querySelector("#logout");
  if (logout) {
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      auth.signOut().then(() => {
        console.log("User signed out");
        window.location.href = "/";
      });
    });
  }

  // login
  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // get user info
      const email = loginForm["login-email"].value;
      const password = loginForm["login-password"].value;
      auth
        .signInWithEmailAndPassword(email, password)
        .then((cred) => {
          console.log(cred.user);
          loginForm.reset();
          window.location.href = "/";
        })
        .catch(function (error) {
          // Handle Errors here

          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("user did not sign up correctly");
          console.log(errorCode);
          console.log(errorMessage);
          alert(errorMessage);
        });
    });
  }
};
