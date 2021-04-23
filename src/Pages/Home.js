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

    latestQuizRef.on("value", (snap) =>
      snap.forEach((childSnapshot) => {
        childSnapshot.forEach((element) => {
          var tempVal = setValues(element, date);
          if (tempVal != date) {
            date = tempVal;
          }
        });
      })
    );
    setDone(true);
  }

  function setValues(element, latestDate) {
    var object = element.val();
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
      <h2>Latest Quiz</h2>
      {latestQuiz !== "" ? (
        <div>
          <a href={`${latestCreator}/${latestQuiz}`}>
            <p>
              {" "}
              {latestQuiz} from {latestCreator}{" "}
            </p>{" "}
          </a>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Home;
