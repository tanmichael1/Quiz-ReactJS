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
            var newUser = user.val().username;

            currentArray.push(newUser.toLowerCase());
          })
        )
        .then(function onSuccess(res) {
          if (currentArray.includes(newUsername.toLowerCase())) {
            alert("Username already used");
            done = true;
          } else {
            auth
              .createUserWithEmailAndPassword(email, password)
              .then((cred) => {
                const userID = cred.user.uid;

                database.ref(`Users/${userID}`).set({
                  username: newUsername,
                  admin: false,

                  id: userID,
                });
                signupForm.reset();
                window.location.href = "/";
              })
              .catch(function (error) {
                // Handle Errors here
                var errorCode = error.code;
                var errorMessage = error.message;
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

  const signupScoreboardForm = document.querySelector("#signupScoreboardForm");
  if (signupScoreboardForm) {
    signupScoreboardForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // get user info
      const newUsername =
        signupScoreboardForm["signupScoreboardForm-username"].value;
      const email = signupScoreboardForm["signupScoreboardForm-email"].value;
      const password =
        signupScoreboardForm["signupScoreboardForm-password"].value;

      const usersRef = database.ref("Users");
      var currentArray = [];

      usersRef
        .once("value", (snap) =>
          snap.forEach((user) => {
            var newUser = user.val().username;

            currentArray.push(newUser.toLowerCase());
          })
        )
        .then(function onSuccess(res) {
          if (currentArray.includes(newUsername.toLowerCase())) {
            alert("Username already used");
            done = true;
          } else {
            auth
              .createUserWithEmailAndPassword(email, password)
              .then((cred) => {
                const userID = cred.user.uid;

                database.ref(`Users/${userID}`).set({
                  username: newUsername,
                  admin: false,

                  id: userID,
                });
                signupForm.reset();
                window.location.href = "/";
              })
              .catch(function (error) {
                // Handle Errors here

                var errorCode = error.code;
                var errorMessage = error.message;
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
          loginForm.reset();
          window.location.href = "/";
        })
        .catch(function (error) {
          // Handle Errors here

          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    });
  }
};
