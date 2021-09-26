import React, { useState } from "react";
import { firebase } from "./../Config";
import { Link } from "react-router-dom";

function User() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [currentUserID, setCurrentUserID] = useState();
  const [image, setImage] = useState();
  function changeProfilePic() {
    var file = document.getElementById("file").value;
    // Create a root reference
    var storageRef = firebase.storage().ref();
    // Create a reference to 'images/mountains.jpg'
    var profileImgRef = storageRef.child(
      `profilePictures/${currentUserID}.jpg`
    );
    const task = profileImgRef.put(file);
    task.on(
      "state_changed",
      (snapshot) => {},
      (error) => {},
      () => {}
    );

    profileImgRef.put(file).then((snapshot) => {
      console.log("Uploaded a file");
    });
    return false;
  }
  function setup() {
    var currentURL = window.location.pathname;
    var splittable = currentURL.split("/");
    var currentUserID = splittable[2];

    var newQuizTitle = unescape(splittable[2]);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //if user page

        if (user.uid == currentUserID) {
          window.location.href = "/profile";
        } else {
        }

        var storage = firebase.storage();
        var storageRef = firebase.storage().ref();
        storageRef
          .child(`profilePictures/${currentUserID}.jpg`)
          .getDownloadURL()
          .then((url) => {
            setProfilePicture(url);
          })
          .catch((err) => {
            console.log(err);
            setDefaultProfilePic();
          });

        setEmail(user.email);
        const dbRefUsers = firebase.database().ref(`Users/${currentUserID}`);
        setCurrentUserID(user.uid);
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
      } else {
        var storage = firebase.storage();
        var storageRef = firebase.storage().ref();
        storageRef
          .child(`profilePictures/${currentUserID}.jpg`)
          .getDownloadURL()
          .then((url) => {
            setProfilePicture(url);
          })
          .catch((err) => {
            console.log(err);
            setDefaultProfilePic();
          });
        const dbRefUsers = firebase.database().ref(`Users/${currentUserID}`);

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
      }
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

  if (!done) {
    setTimeout(() => {
      setup();
      setLoading(false);
      setFinished(true);
    }, 4000);
  }

  return (
    <div className="container box">
      {loading ? <div id="loading">Loading</div> : <div id="notLoading"></div>}
      {finished ? (
        <div>
          <h1>{username}</h1>
          <br />
          <img width="300" height="300" src={profilePicture} />
          <br />

          <hr />

          <h2>Created quizzes</h2>
          {createdQuizzes.length > 0 ? (
            <>
              {createdQuizzes.map((quiz, i) => (
                <div key={i}>
                  <Link
                    to={{
                      pathname: `${currentUserID}/${quiz.title}`,
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
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default User;
