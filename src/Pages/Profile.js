import React, { useState } from "react";
import { firebase } from "./../Config";
function Profile() {
  const [done, setDone] = useState(false);
  const [id, setId] = useState();
  const [username, setUsername] = useState("");
  let createdQuizzes = [];
  let takenQuizzes = [];
  function setup() {
    firebase.auth().onAuthStateChanged((user) => {
      setId(user.uid);
      const dbRefUsers = firebase.database().ref(`Users/${user.uid}`);
      dbRefUsers.on("value", (snap) => {
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
      {createdQuizzes > 0 ? <div>Test</div> : <div>Empty</div>}

      <h2>Recently taken quizzes</h2>
      {takenQuizzes > 0 ? <div>Test</div> : <div>Taken no quizzes</div>}
    </div>
  );
}

export default Profile;
