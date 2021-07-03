import React, { useState } from "react";
import { firebase } from "./../Config";
import { Link } from "react-router-dom";

function Profile() {
  const [done, setDone] = useState(false);
  const [username, setUsername] = useState("");
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  let takenQuizzes = [];
  function setup() {
    console.log("Here");
    firebase.auth().onAuthStateChanged((user) => {
      const dbRefUsers = firebase.database().ref(`Users/${user.uid}`);
      const dbCreatedQuizzes = dbRefUsers.child("createdQuizzes");
      dbRefUsers.on("value", (user) => {
        console.log(user.val());
        if (user.val().createdQuizzes == undefined) {
          console.log("undefined");
        } else {
          dbCreatedQuizzes.on("value", (userQuizzes) =>
            userQuizzes.forEach((quiz) => {
              var tempArray = createdQuizzes;
              console.log(quiz.val());
              tempArray.push({
                title: quiz.val().title,
              });

              setCreatedQuizzes(tempArray);
            })
          );
        }
        setUsername(user.val().username);
      });
    });

    setDone(true);
  }

  function changePassword() {
    // Ask signed in user for current password.
    const currentPass = window.prompt("Please enter current password");
    const emailCred = firebase.auth.EmailAuthProvider.credential(
      firebase.auth().currentUser,
      currentPass
    );
    firebase
      .auth()
      .currentUser.reauthenticateWithCredential(emailCred)
      .then(() => {
        // User successfully reauthenticated.
        const newPass = window.prompt("Please enter new password");
        return firebase.auth().currentUser.updatePassword(newPass);
      })
      .catch((error) => {
        // Handle error.
      });
  }

  function test() {
    let user = firebase.auth().currentUser;
    let newPassword = "Password";

    user.updatePassword(newPassword).then(
      () => {
        // Update successful.
      },
      (error) => {
        // An error happened.
      }
    );
  }

  function toggleUsername() {
    if (
      document.getElementById("usernameChange").classList.contains("hidden")
    ) {
      document.getElementById("usernameChange").classList.remove("hidden");
    } else {
      document.getElementById("usernameChange").classList.add("hidden");
    }
  }

  function changeUsername() {
    document.getElementById("verifyPassword");
    var newUsername = document.getElementById("newUsername").value;
    var result = window.confirm(
      "Are you sure you want to change your username to " + newUsername + "?"
    );
    if (result) {
    }
  }

  function togglePassword() {
    if (
      document.getElementById("passwordChange").classList.contains("hidden")
    ) {
      document.getElementById("passwordChange").classList.remove("hidden");
    } else {
      document.getElementById("passwordChange").classList.add("hidden");
    }
  }

  function changePassword() {
    document.getElementById("currentPassword");
    var newPassword = document.getElementById("newPassword").value;
    var confirmNewPassword =
      document.getElementById("confirmNewPassword").value;
    console.log(newPassword);
    console.log(confirmNewPassword);
    if (newPassword == confirmNewPassword) {
      var result = window.confirm(
        "Are you sure you want to change your password to " + newPassword + "?"
      );
      if (result) {
      }
    } else {
      alert("Passwords must be identical");
    }
  }

  if (!done) {
    setup();
  }
  return (
    <div className="container box">
      <h1>{username}</h1>
      <hr />

      <h2>Created quizzes</h2>
      {createdQuizzes.length > 0 ? (
        <>
          {createdQuizzes.map((quiz, i) => (
            <div key={i}>
              <Link
                to={{
                  pathname: `${username}/${quiz.title}`,
                }}
              >
                <h3>{quiz.title}</h3>
              </Link>{" "}
              <br />
            </div>
          ))}
        </>
      ) : (
        <div>Not created any quizzes</div>
      )}

      <hr />
      <h2>Settings</h2>
      <div id="profileButtons hidden">
        <button
          onClick={() => toggleUsername()}
          id="changeUsername"
          className="btn btn-primary"
        >
          Change Username
        </button>
        <br />
        <div id="usernameChange" className="hidden">
          <label>Your new Username</label>
          <br />
          <input id="newUsername" type="text" />
          <br />
          <label>Your password</label>
          <br />
          <input id="verifyPassword" type="text" />
          <br />
          <button onClick={() => changeUsername()}>Change Username</button>
          <hr />
        </div>

        <button
          onClick={() => togglePassword()}
          id="changePassword"
          className="btn btn-primary"
        >
          Change Password
        </button>

        <div id="passwordChange" className="hidden">
          <label>Your password</label>
          <br />
          <input id="currentPassword" type="text" />
          <br />
          <label>Your new password</label>
          <br />
          <input id="newPassword" type="text" />
          <br />
          <label>Confirm new password</label>
          <br />
          <input id="confirmNewPassword" type="text" />
          <br />

          <button onClick={() => changePassword()}>Change Password</button>
          <hr />
        </div>
        <br />
        <button className="btn btn-danger" id="deleteAccount">
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Profile;
