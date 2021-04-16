import React, { useState } from "react";
import { firebase } from "./../Config";

function Home() {
  const [currentDate, setCurrentDate] = useState(null);
  const [done, setDone] = useState(false);
  const [latestQuiz, setLatestQuiz] = useState("");
  const [latestCreator, setLatestCreator] = useState("");

  const latestQuizRef = firebase.database().ref("Quizzes");

  if (!done) {
    latestQuizRef.on("value", (snap) =>
      snap.forEach((childSnapshot) => {
        childSnapshot.forEach((element) => {
          //var tempDate = element.val().createdSortDate;

          // console.log("tempDate: " + tempDate);
          // console.log("latestDate: " + currentDate);
          // console.log(element.val().Title);
          setValues(element);

          // console.log(tempDate > currentDate);
        });
      })
    );
    setDone(true);
  }

  function setValues(element) {
    var object = element.val();
    if (currentDate == null || object.createdSortDate > currentDate) {
      setLatestQuiz(object.Title);
      let newDate = object.createdSortDate;
      //console.log(newDate);
      setCurrentDate();
      setCurrentDate(newDate);
      setLatestCreator(object.creator);
      // console.log(currentDate);
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
    <div className="container">
      <h1>Welcome to the Website</h1>
      <h2>Latest Quiz</h2>
      {latestQuiz !== "" ? (
        <div>
          <p>
            {" "}
            {latestQuiz} from {latestCreator}{" "}
          </p>{" "}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Home;
