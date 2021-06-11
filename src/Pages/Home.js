import React, { useState } from "react";
import { firebase } from "./../Config";

function Home() {
  const [currentDate, setCurrentDate] = useState(null);
  const [done, setDone] = useState(false);
  const [latestQuiz, setLatestQuiz] = useState("");
  const [latestCreator, setLatestCreator] = useState("");

  const latestQuizRef = firebase.database().ref("Quizzes");

  if (!done) {
    var date = null;

    latestQuizRef.on("value", (quizzes) =>
      quizzes.forEach((user) => {
        user.forEach((quiz) => {
          var tempVal = setValues(quiz, date);
          if (tempVal != date) {
            date = tempVal;
          }
        });
      })
    );
    setDone(true);
  }

  function setValues(quiz, latestDate) {
    var object = quiz.val();
    if (latestDate === null || object.createdSortDate > latestDate) {
      setLatestQuiz(object.Title);
      let newDate = object.createdSortDate;
      setCurrentDate(newDate);

      setLatestCreator(object.creator);
      return newDate;
    } else {
      return latestDate;
    }
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
  if (!done) {
    setup();
  }

  return (
    <div className="container box">
      <h1>Welcome to the Website</h1>
      <hr />
      <h2>Latest Quiz</h2>
      {latestQuiz !== "" ? (
        <div>
          <a href={`${latestCreator}/${latestQuiz}`}>
            <h3>
              {" "}
              {latestQuiz} from {latestCreator}{" "}
            </h3>{" "}
          </a>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Home;
