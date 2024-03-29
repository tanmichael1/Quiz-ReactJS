import React, { useState } from "react";
import { firebase } from "./../Config";
import { Link } from "react-router-dom";

function Profile() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [userID, setUserID] = useState();
  const [image, setImage] = useState();

  function setup() {
    firebase.auth().onAuthStateChanged((user) => {
      var storage = firebase.storage();
      var storageRef = firebase.storage().ref();
      storageRef
        .child(`profilePictures/${user.uid}.jpg`)
        .getDownloadURL()
        .then((url) => {
          setProfilePicture(url);
        })
        .catch((err) => {
          console.log(err);
          setDefaultProfilePic();
        });
      setEmail(user.email);
      const dbRefUsers = firebase.database().ref(`Users/${user.uid}`);
      setUserID(user.uid);
      const dbCreatedQuizzes = dbRefUsers.child("createdQuizzes");

      dbRefUsers.on("value", (user) => {
        if (user.val().createdQuizzes == undefined) {
          console.log("undefined");
        } else {
          dbCreatedQuizzes.once("value", (userQuizzes) =>
            userQuizzes.forEach((quiz) => {
              var tempArray = createdQuizzes;
              tempArray.push({
                title: quiz.val().title,
              });

              setCreatedQuizzes(tempArray);
            })
          );
        }
      });

      dbRefUsers.once("value", (test) => {
        setUsername(test.val().username);
      });
    });

    setDone(true);
  }

  function setDefaultProfilePic() {
    var storageRef = firebase.storage().ref();
    storageRef
      .child("profilePictures/defaultProfilePic.jpg")
      .getDownloadURL()
      .then((url) => {
        setProfilePicture(url);
      });
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
    var verifyPassword = document.getElementById("verifyPassword").value;
    var newUsername = document.getElementById("newUsername").value;
    var result = window.confirm(
      "Are you sure you want to change your username to " + newUsername + "?"
    );

    if (result) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, verifyPassword)
        .then(function (userCredential) {
          const dbRefUsers = firebase.database().ref(`Users/${userID}`);
          const dbCreatedQuizzes = dbRefUsers.child("createdQuizzes");

          const dbRefQuizTitles = firebase.database().ref(`Quizzes/${userID}`);
          dbRefQuizTitles.on("value", (quiz) => {
            quiz.forEach((test) => {
              var title = test.val().Title;

              // test.update({ creator: newUsername });

              firebase.database().ref(`Quizzes/${userID}/${title}`).update({
                creator: newUsername,
              });
            });
          });

          firebase.database().ref(`Users/${userID}`).update({
            username: newUsername,
          });

          setTimeout(() => {
            window.location.href = "/profile";
          }, 1000);
        })
        .then(function (e) {
          alert(
            "Username change successful. Your username is now " + newUsername
          );
          document.getElementById("verifyPassword").value = "";
          document.getElementById("newUsername").value = "";
        })
        .catch((error) => {
          alert(error);
          console.log(error);
          // Handle error.
        });
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

  function toggleEmail() {
    if (document.getElementById("emailChange").classList.contains("hidden")) {
      document.getElementById("emailChange").classList.remove("hidden");
    } else {
      document.getElementById("emailChange").classList.add("hidden");
    }
  }
  function changePassword() {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;

    if (confirmNewPassword == newPassword) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, currentPassword)
        .then(function (userCredential) {
          userCredential.user.updatePassword(newPassword);
        })
        .then(function (e) {
          alert(
            "Password change successful. Your password is now " + newPassword
          );
          document.getElementById("currentPassword").value = "";
          document.getElementById("newPassword").value = "";
          document.getElementById("confirmNewPassword").value = "";
        })
        .catch((error) => {
          alert(error);
          console.log(error);
          // Handle error.
        });
    } else {
      alert("Password and Confirm Password must be the same");
    }
  }

  function changeEmail() {
    const currentPass = document.getElementById("emailPasswordVerify").value;

    var currEmail = document.getElementById("currentEmail").value;
    var newEmail = document.getElementById("newEmail").value;

    firebase
      .auth()
      .signInWithEmailAndPassword(currEmail, currentPass)
      .then(function (userCredential) {
        userCredential.user.updateEmail(newEmail);
      })
      .then(function (e) {
        alert(
          "Email address change successful. Your email address is now " +
            newEmail
        );
        document.getElementById("newEmail").value = "";
        document.getElementById("currentEmail").value = "";
        document.getElementById("emailPasswordVerify").value = "";
      })
      .catch((error) => {
        alert(error);
        console.log(error);
        // Handle error.
      });
  }

  function toggleDelete() {
    if (document.getElementById("deleteChange").classList.contains("hidden")) {
      document.getElementById("deleteChange").classList.remove("hidden");
    } else {
      document.getElementById("deleteChange").classList.add("hidden");
    }
  }

  function deleteAccount(removeQuizzes) {
    const currentPass = window.prompt(
      "Please enter your password to confirm you want to delete your account."
    );

    if (currentPass) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, currentPass)
        .then(function (userCredential) {
          const user = firebase.auth().currentUser;
          const uid = firebase.auth().currentUser.uid;
          var currentArray = [];

          if (removeQuizzes) {
            const ref = firebase.database().ref();
            const dbTestQuiz = ref.child("Quizzes/" + uid);
            dbTestQuiz.remove();
          }

          user
            .delete()
            .then(() => {
              const usersRef = firebase.database().ref(`Users/${uid}`);

              usersRef.remove();
              window.location.href = "/";

              // User deleted.
            })
            .catch((error) => {
              console.log(error);
              alert(error);
              // An error ocurred
              // ...
            });
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  if (!done) {
    setTimeout(() => {
      setup();
      setLoading(false);
      setFinished(true);
    }, 4000);
  }

  const upload = (e) => {
    e.preventDefault();
    if (image == null) {
      e.preventDefault();
    } else {
      console.log(image);
      firebase
        .storage()
        .ref()
        .child(`profilePictures/${userID}.jpg`)
        .put(image)
        .on("state_changed", alert("success"));
    }
  };

  return (
    <div className="container box">
      {loading ? <div id="loading">Loading</div> : <div id="notLoading"></div>}
      {finished ? (
        <div>
          <h1>{username}</h1>
          <br />
          <img width="300" height="300" src={profilePicture} />
          <br />
          <form>
            <br />
            <input
              type="file"
              id="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
            <br />
            <button className="btn btn-primary" id="send" onClick={upload}>
              Submit
            </button>
          </form>
          <hr />

          <h2>Created quizzes</h2>
          {createdQuizzes.length > 0 ? (
            <>
              {createdQuizzes.map((quiz, i) => (
                <div key={i}>
                  <Link
                    to={{
                      pathname: `${userID}/${quiz.title}`,
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
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => changeUsername()}
              >
                Change Username
              </button>
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

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => changePassword()}
              >
                Change Password
              </button>
              <hr />
            </div>
            <br />

            <button
              onClick={() => toggleEmail()}
              id="changeEmail"
              className="btn btn-primary"
            >
              Change Email
            </button>

            <div id="emailChange" className="hidden">
              <label>Your email</label>
              <br />
              <input id="currentEmail" type="text" />
              <br />
              <label>Your new email</label>
              <br />
              <input id="newEmail" type="text" />
              <br />
              <label>Your password</label>
              <br />
              <input id="emailPasswordVerify" type="text" />
              <br />

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => changeEmail()}
              >
                Change Email
              </button>
            </div>

            <br />
            <button
              className="btn btn-danger"
              id="deleteAccount"
              onClick={() => toggleDelete()}
            >
              Delete Account
            </button>

            <div id="deleteChange" className="hidden">
              <button
                className="btn btn-danger"
                id="deleteAccount"
                onClick={() => deleteAccount(false)}
              >
                Delete Account without Quizzes
              </button>
              <button
                className="btn btn-danger"
                id="deleteAccount"
                onClick={() => deleteAccount(true)}
              >
                Delete Account with Quizzes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Profile;
