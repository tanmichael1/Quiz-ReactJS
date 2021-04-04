/**
 * This is the Quizzes Screen.
 */
import React, { useState } from "react";
import { firebase } from "../Config";
import { Link, BrowserRouter as Router } from "react-router-dom";
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
  const ref = firebase.database().ref();

  if (!done) {
    doStuff();
    setTimeout(() => {
      setLoading(false);
      setFinished(true);
    }, 2000);
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
          {quizArray.map((quiz) => (
            <div>
              <Link
                to={{
                  pathname: `${quiz.user}/${quiz.title}`,
                }}
              >
                {quiz.title}
              </Link>

              {/* <a href={`${quiz.user}/${quiz.title}`}> {quiz.title}</a> */}
            </div>
          ))}
        </div>
      ) : (
        <div id="notFinished"></div>
      )}
    </div>
  );
}
