import React, { useState } from "react";
import { firebase } from "./../Config";
import { Link } from "react-router-dom";
function Profile() {
  const [done, setDone] = useState(false);
  const [id, setId] = useState();
  const [username, setUsername] = useState("");
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  let takenQuizzes = [];
  function setup() {
    firebase.auth().onAuthStateChanged((user) => {
      setId(user.uid);
      const dbRefUsers = firebase.database().ref(`Users/${user.uid}`);
      const dbCreatedQuizzes = dbRefUsers.child("createdQuizzes");
      dbRefUsers.on("value", (snap) => {
        console.log(snap.val().createdQuizzes);
        if (snap.val().createdQuizzes == undefined) {
          console.log("undefined");
        } else {
          dbCreatedQuizzes.on("value", (snap) =>
            snap.forEach((childSnapshot) => {
              var tempArray = createdQuizzes;
              tempArray.push({
                title: childSnapshot.val().title,
              });

              setCreatedQuizzes(tempArray);
              console.log(createdQuizzes.length);
            })
          );
        }
        setUsername(snap.val().username);
      });
    });

    setDone(true);
  }
  if (!done) {
    setup();
  }
  return (
    <div className="container">
      <h1>{username}</h1>

      <h2>Created quizzes</h2>
      {createdQuizzes.length > 0 ? (
        <div>
          {createdQuizzes.map((quiz) => (
            <div>
              <Link
                to={{
                  pathname: `${username}/${quiz.title}`,
                }}
              >
                {quiz.title}
              </Link>
              <br />
            </div>
          ))}
        </div>
      ) : (
        <div>Not created any quizzes</div>
      )}

      <h2>Recently taken quizzes</h2>
      {takenQuizzes > 0 ? <div>Test</div> : <div>Taken no quizzes</div>}
    </div>
  );
}

export default Profile;
