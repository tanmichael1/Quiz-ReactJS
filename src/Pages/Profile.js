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

  function test2() {}

  if (!done) {
    setup();
  }
  return (
    <div className="container box">
      <h1>{username}</h1>
      <hr />

      <h2>Created quizzes</h2>
      {createdQuizzes.length > 0 ? (
        <div>
          {createdQuizzes.map((quiz, i) => (
            <div key={i}>
              <Link
                to={{
                  pathname: `${username}/${quiz.title}`,
                }}
              >
                {quiz.title}
              </Link>{" "}
              <br />
            </div>
          ))}
        </div>
      ) : (
        <div>Not created any quizzes</div>
      )}

      <hr />
      <div id="profileButtons hidden">
        <button
          onClick={() => test()}
          id="changePassword"
          className="btn btn-primary"
        >
          Change Password
        </button>{" "}
        <br />
        <button className="btn btn-danger" id="deleteAccount">
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Profile;
