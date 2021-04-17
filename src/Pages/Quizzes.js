/**
 * This is the Quizzes Screen.
 */
import React, { useState } from "react";
import { firebase } from "../Config";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

/**
 *
 * This screen shows the posts of all users.
 *
 */
export default function Quizzes() {
  const [done, setDone] = useState(false);
  const [quizArray, setQuizArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const quizzesRef = firebase.database().ref("Quizzes");

  //quizArray

  if (!done) {
    doStuff();

    setTimeout(() => {
      setLoading(false);
      setFinished(true);
    }, 5000);
    setDone(true);
  }

  function doStuff() {
    quizzesRef.on("value", (snap) =>
      //childsnapshot - each user

      snap.forEach((childSnapshot) => {
        var currentArray = quizArray;

        //Each element

        childSnapshot.forEach((element) => {
          //element - each quiz

          var newTitle = element.val().Title;
          var newUser = element.val().creator;

          currentArray.push({
            title: newTitle,
            user: newUser,
          });
          currentArray.sort(function (a, b) {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
          });
          setQuizArray(currentArray);
        });
      })
    );
  }

  return (
    <div className="container">
      <h1>Welcome to Quizzes</h1>

      <Button id="refresh">Refresh Quizzes</Button>

      {loading ? <div id="loading">Loading</div> : <div id="notLoading"></div>}

      {finished ? (
        <div id="finished">
          {quizArray.map((quiz, i) => (
            <div key={i}>
              <Link
                to={{
                  pathname: `${quiz.user}/${quiz.title}`,
                }}
              >
                {quiz.title}
              </Link>{" "}
              from {quiz.user}
            </div>
          ))}
        </div>
      ) : (
        <div id="notFinished"></div>
      )}
      <br />
    </div>
  );
}
