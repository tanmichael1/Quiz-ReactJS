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
    console.log("Here");
    firebase.auth().onAuthStateChanged((user) => {
      setId(user.uid);
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
    </div>
  );
}

export default Profile;
