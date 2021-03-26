import React, { useState } from "react";
import { firebase } from "./../Config";
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
        setUsername(snap.val().username);
        if (snap.val().createdQuizzes == undefined) {
        } else {
          dbCreatedQuizzes.on("value", (snap) =>
            snap.forEach((childSnapshot) => {
              var tempArray = createdQuizzes;
              setCreatedQuizzes(tempArray.push(childSnapshot.val().title));
            })
          );
        }
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
      {createdQuizzes > 0 ? (
        <div>Test</div>
      ) : (
        <div>Not created any quizzes</div>
      )}

      <h2>Recently taken quizzes</h2>
      {takenQuizzes > 0 ? <div>Test</div> : <div>Taken no quizzes</div>}
    </div>
  );
}

export default Profile;
