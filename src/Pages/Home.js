import React, { useState } from "react";
import { firebase } from "./../Config";
import { Link } from "react-router-dom";

function Home() {
  // Setup
  const [done, setDone] = useState(false);
  const latestQuizzesRef = firebase.database().ref("Quizzes");
  const [latestQuizzes, setLatestQuizzes] = useState(null);

  if (!done) {
    setTimeout(() => {
      setup();
      var quizArray = [];

      latestQuizzesRef
        .once("value", (quizzes) =>
          quizzes.forEach((user) => {
            console.log(user.val());
            user.forEach((quiz) => {
              if (!quiz.val().testQuiz) {
                quizArray.push(quiz.val());
              }
            });
            quizArray.sort(function (a, b) {
              if (a.createdSortDate < b.createdSortDate) {
                return 1;
              } else if (a.createdSortDate > b.createdSortDate) {
                return -1;
              }
              return 0;
            });
          })
        )
        .then(function () {
          setValues(quizArray);
        });

      setDone(true);
    }, 3000);
  }

  function setValues(latestArray) {
    var newArray = [];
    newArray.push(latestArray[0]);
    newArray.push(latestArray[1]);
    newArray.push(latestArray[2]);
    setLatestQuizzes(newArray);
  }

  function setup() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid);
      } else {
      }
    });
    setDone(true);
  }

  return (
    <div className="container box">
      <h1>Welcome to the Website</h1>
      <hr />
      <h2>Latest Quizzes</h2>

      {latestQuizzes != null ? (
        <div className="latestQuizzes trueCenter">
          {latestQuizzes.map((quiz, index) => (
            <div key={index}>
              <span>
                <a href={`${quiz.creatorID}/${quiz.Title}`}>{quiz.Title}</a>{" "}
                from{" "}
                <Link
                  to={{
                    pathname: `users/${quiz.creatorID}`,
                  }}
                >
                  {quiz.creator}
                </Link>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>Loading quizzes</p>{" "}
        </div>
      )}
    </div>
  );
}

export default Home;
