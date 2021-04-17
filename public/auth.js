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

      // sign up the user
      auth.createUserWithEmailAndPassword(email, password).then((cred) => {
        console.log(cred.user);
        console.log(cred.user.uid);
        const userID = cred.user.uid;

        database.ref(`Users/${userID}`).set({
          username: newUsername,
        });
        signupForm.reset();
        window.location.href = "/";
      });
    });
  }

  // logout
  const logout = document.querySelector("#logout");
  console.log("here");
  console.log("Null or not: ", logout);
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
      auth.signInWithEmailAndPassword(email, password).then((cred) => {
        console.log(cred.user);
        loginForm.reset();
        window.location.href = "/";
      });
    });
  }
};
