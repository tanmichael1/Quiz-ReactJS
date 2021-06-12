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

  if (!done) {
    listQuizzes();
    setTimeout(() => {
      setLoading(false);
      setFinished(true);
    }, 3000);
    setDone(true);
  }

  function listQuizzes() {
    quizzesRef.on("value", (snap) =>
      snap.forEach((user) => {
        var currentArray = quizArray;

        user.forEach((quiz) => {
          var newTitle = quiz.val().Title;
          var newUser = quiz.val().creator;

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
    <div className="container box">
      <h1 id="quizzesTitle">Welcome to Quizzes</h1>

      <div className="">
        <Button id="refresh">Refresh Quizzes</Button>
      </div>

      {loading ? <div id="loading">Loading</div> : <div id="notLoading"></div>}

      {finished ? (
        <div id="finished">
          <div id="finished2">
            {quizArray.map((quiz, i) => (
              <h3 id="center" key={i}>
                <Link
                  to={{
                    pathname: `${quiz.user}/${quiz.title}`,
                  }}
                >
                  {quiz.title}
                </Link>{" "}
                from {quiz.user}
              </h3>
            ))}
          </div>
        </div>
      ) : (
        <div id="notFinished"></div>
      )}
      <br />
    </div>
  );
}
