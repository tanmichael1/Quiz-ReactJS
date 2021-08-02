import React, { useState } from "react";
import { firebase } from "./../Config";

function Home() {
  const [done, setDone] = useState(false);
  const [latestQuiz, setLatestQuiz] = useState("");
  const [latestCreator, setLatestCreator] = useState("");
  const [latestCreatorID, setLatestCreatorID] = useState("");
  const latestQuizRef = firebase.database().ref("Quizzes");

  if (!done) {
    setup();
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

      setLatestCreator(object.creator);
      setLatestCreatorID(object.creatorID);
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

  return (
    <div className="container box">
      <h1>Welcome to the Website</h1>
      <hr />
      <h2>Latest Quiz</h2>
      {latestQuiz !== "" ? (
        <div>
          <a href={`${latestCreatorID}/${latestQuiz}`}>
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
