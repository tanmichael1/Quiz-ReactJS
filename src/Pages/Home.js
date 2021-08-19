import React, { useState } from "react";
import { firebase } from "./../Config";
import Slideshow from "./components/Slideshow";

function Home() {
  const [done, setDone] = useState(false);
  const [latestQuiz, setLatestQuiz] = useState("");
  const [latestQuizzes, setLatestQuizzes] = useState("");
  const [latestCreator, setLatestCreator] = useState("");
  const [index, setIndex] = React.useState(0);
  const [latestCreatorID, setLatestCreatorID] = useState("");
  const colors = ["#0088FE", "#00C49F", "#FFBB28"];
  const delay = 2500;

  const latestQuizRef = firebase.database().ref("Quizzes");

  if (!done) {
    setup();
    var date = null;
    var array = [];

    latestQuizRef.on("value", (quizzes) =>
      quizzes.forEach((user) => {
        user.forEach((quiz) => {
          array.push(quiz.val());
          // var tempVal = setValues(quiz, date);

          // if (tempVal != date) {
          //   date = tempVal;
          // }
        });
        array.sort(function (a, b) {
          if (a.createdSortDate < b.createdSortDate) {
            return 1;
          } else if (a.createdSortDate > b.createdSortDate) {
            return -1;
          }
          return 0;
        });

        setValues2(array);
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

  function setValues2(prevArray) {
    var newArray = [];
    newArray.push(prevArray[0]);
    newArray.push(prevArray[1]);
    newArray.push(prevArray[2]);
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

  const timeoutRef = React.useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay,
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="container box">
      <h1>Welcome to the Website</h1>
      <hr />
      <h2>Latest Quizzes</h2>

      {latestQuizzes != "" ? (
        <div className="slideshow">
          <div
            className="slideshowSlider"
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
          >
            {latestQuizzes.map((quiz, index) => (
              <div
                className="slide"
                key={index}
                style={{
                  // backgroundColor: "#0088FE"
                  backgroundColor: "white",
                }}
                // style={{ backgroundColor }}
              >
                <div className="slideText">
                  <span>
                    <a href={`${quiz.creatorID}/${quiz.Title}`}>{quiz.Title}</a>{" "}
                    from {quiz.creator}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="slideshowDots">
            {colors.map((_, idx) => (
              <div
                key={idx}
                className={`slideshowDot${index === idx ? " active" : ""}`}
                onClick={() => {
                  setIndex(idx);
                }}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>Loading quizzes</p>{" "}
        </div>
      )}
      {/* {latestQuiz !== "" ? (
        <div>
          <a href={`${latestCreatorID}/${latestQuiz}`}>
            <h3>
              {" "}
              {latestQuiz} from {latestCreator}{" "}
            </h3>{" "}
          </a>
        </div>
      ) : (
        <div>
          <p>Loading latest quiz</p>
        </div>
      )} */}
    </div>
  );
}

export default Home;
