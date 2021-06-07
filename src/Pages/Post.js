import "../App.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { firebase } from "./../Config";
import { noConflict } from "jquery";

export default function Post() {
  const [done, setDone] = useState(false);
  const [numQuestions, setNumQuestions] = useState(0);
  const [currentUser, setCurrentUser] = useState();
  const [currentUserID, setCurrentUserID] = useState();
  const [isCreator, setIsCreator] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const [answered, setAnswered] = useState(false);

  const [initial, setInitial] = useState(true);
  const [quiz, setQuiz] = useState(false);
  const [end, setEnd] = useState(false);
  const [results, setResults] = useState(false);
  const [score, setScore] = useState(0);
  const [response, setResponse] = useState([]);
  const [selected, setSelected] = useState(false);
  const [correct, setCorrect] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(0);
  const [trueAnswer, setTrueAnswer] = useState(0);

  const [quizData, setQuizData] = useState([]);
  const [quizUser, setQuizUser] = useState();
  const [quizTitle, setQuizTitle] = useState(null);

  //Other quiz details
  const [savedDateCreated, setSavedDateCreated] = useState();
  const [savedTimeCreated, setSavedTimeCreated] = useState();
  const [savedCreatedSortDate, setSavedCreatedSortDate] = useState();

  const [swapIndex, setSwapIndex] = useState();

  const progressBarFull = document.getElementById("progressBarFull");

  /* Setup */

  if (!done) {
    const ref = firebase.database().ref();
    const dbRefObject = firebase.database().ref().child("object");

    var currentURL = window.location.pathname;
    var splittable = currentURL.split("/");
    var user = splittable[1];
    setQuizUser(user);
    setup(user);

    var newQuizTitle = unescape(splittable[2]);
    dbRefObject.on("value", (snap) => console.log(snap.val()));

    const dbTestQuiz = ref.child("Quizzes/" + user + "/" + newQuizTitle);

    dbTestQuiz.on("value", function (quiz) {
      var count = quiz.child("NumQuestions").val();
      console.log(quiz.val());
      setNumQuestions(count);
      setSavedDateCreated(quiz.child("dateCreated").val());
      setSavedTimeCreated(quiz.child("timeCreated").val());
      setSavedCreatedSortDate(quiz.child("createdSortDate").val());

      for (var i = 0; i < count; i++) {
        loadQuestions(quiz.child(i + 1).val());
      }
      setQuizTitle(newQuizTitle);
    });

    setDone(true);
  }

  function setup(currUser) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const dbRefUsers = firebase
          .database()
          .ref("Users/" + user.uid + "/username");
        console.log(user.uid);
        setCurrentUserID(user.uid);
        dbRefUsers.on("value", function (snapUser) {
          console.log("snap.val(): " + snapUser.val());
          console.log("quizUser: " + currUser);
          setCurrentUser(snapUser.val());
          if (snapUser.val() === currUser) {
            setIsCreator(true);
            console.log("User's Quiz");
          } else {
            console.log("Not creator");
          }
        });
      } else {
        console.log("User is not logged in");
        setCurrentUser("guest");
      }
    });
  }

  function loadQuestions(quiz: object) {
    var answerOptionsData = quiz.answerOptions;
    console.log(answerOptionsData);
    var array = quizData;

    array.push({
      questionText: quiz.questionText,
      answerOptions: answerOptionsData,
    });
    setQuizData(array);
  }

  /* Quiz Buttons */

  function handleStartButtonClick() {
    console.log(currentQuestion);
    //console.log(progressBarFull);

    setInitial(false);

    setQuiz(true);
    // progressBarFull.style.width = `${
    //   ((currentQuestion + 1) / numQuestions) * 100
    // }%`;
  }

  function handleCheckButtonClick() {
    const answerButtonsElement = document.getElementById("answer-buttons");

    if (selected) {
      var currentResponse = response;

      if (correct) {
        setScore(score + 1);
        currentResponse.push({
          question: quizData[currentQuestion].questionText,
          yourAnswer: currentAnswer,
          correctAnswer: trueAnswer,
          color: "green",
        });
      } else {
        currentResponse.push({
          question: quizData[currentQuestion].questionText,
          yourAnswer: currentAnswer,
          correctAnswer: trueAnswer,
          color: "red",
        });
      }

      setResponse(currentResponse);

      Array.from(answerButtonsElement.children).forEach((button) => {
        console.log(currentAnswer);

        if (currentAnswer === button.innerHTML) {
          if (currentAnswer === trueAnswer) {
            button.classList.add("correct");
          } else {
            button.classList.add("incorrect");
          }
        } else {
          if (button.innerHTML === trueAnswer) {
            button.classList.add("correct");
          }
        }
      });
      setAnswered(true);

      const nextQuestion = currentQuestion + 1;
      document.getElementById("check-btn").hidden = true;
      if (nextQuestion < quizData.length) {
        document.getElementById("next-btn").hidden = false;
      } else {
        document.getElementById("finish-btn").hidden = false;
      }
    }
  }

  function handleNextButtonClick() {
    document.getElementById("next-btn").hidden = true;
    document.getElementById("check-btn").hidden = false;
    refreshButtons();

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      setAnswered(false);
      console.log(currentQuestion);
      progressBarFull.style.width = `${(nextQuestion / numQuestions) * 100}%`;
      console.log("currentQuestion: " + currentQuestion);
      console.log("numQuestions: " + numQuestions);
      console.log(
        "currentQuestion / numQuestions) * 100: " +
          (nextQuestion / numQuestions) * 100
      );
    } else {
      alert("You have reached the end of the quiz");

      handleNextButtonClick();
    }
  }

  function refreshButtons() {
    const answerButtonsElement = document.getElementById("answer-buttons");
    Array.from(answerButtonsElement.children).forEach((button) => {
      button.classList.remove("incorrect");
      button.classList.remove("correct");
      button.classList.remove("marked");
    });
  }

  function handleFinishButtonClick() {
    setSelected(false);
    setAnswered(false);
    setQuiz(false);
    setEnd(true);
  }

  function handleHomeButtonClick() {
    setCurrentQuestion(0);

    setScore(0);
    refreshResults();
    setInitial(true);
    setEnd(false);
  }

  function handleResultsButtonClick() {
    setResults(true);
    setEnd(false);
  }

  function handleRestartButtonClick() {
    setCurrentQuestion(0);
    setScore(0);
    refreshResults();

    setEnd(false);
    setQuiz(true);
  }
  function handleReturnEndButtonClick() {
    setResults(false);
    setEnd(true);
  }

  const handleAnswerButtonClick = (text, isCorrect) => {
    if (!answered) {
      const answerButtonsElement = document.getElementById("answer-buttons");
      setCurrentAnswer(text);
      setCorrect(isCorrect);

      quizData[currentQuestion].answerOptions.forEach((answer) => {
        if (answer.isCorrect) {
          setTrueAnswer(answer.answerText);
        }

        if (answer.answerText === text) {
          console.log(answer);
        }
      });
      setSelected(true);

      Array.from(answerButtonsElement.children).forEach((button) => {
        console.log(currentAnswer);

        if (text === button.innerHTML) {
          //Save button
          button.classList.add("marked");
        } else {
          button.classList.remove("marked");
        }
      });
    }
  };

  /* Editing Mode */

  function toggleEditQuiz() {
    setEditingMode(!editingMode);
  }

  function removeQuiz(e) {
    if (window.confirm("Are you sure you wish to delete this Quiz?")) {
      //this.deleteItem(e);
      const ref = firebase.database().ref();
      const dbTestQuiz = ref.child("Quizzes/" + quizUser + "/" + quizTitle);
      dbTestQuiz.remove();
      const dbQuizForUser = firebase
        .database()
        .ref("Users/" + currentUserID + "/createdQuizzes/" + quizTitle);
      dbQuizForUser.remove();

      //Redirects
      window.location.href = "/";
    }
  }

  function updateQuiz() {
    var editQuestions = document.getElementsByClassName("editQuestions");
    var checkboxes = document.getElementsByClassName("checkboxes");
    var answersEdit = document.getElementsByClassName("answer");
    var deleteCheckboxes = document.getElementsByClassName("deleteCheckboxes");
    var numDeleteCheckboxes = 0;

    var finalArray = [];
    for (var i = 0; i < editQuestions.length; i++) {
      var questionNumTest = i;
      var answersArray = [];
      for (var j = 0; j < answersEdit.length; j++) {
        console.log(answersEdit[j]);
        console.log(
          "questionnum2: " + answersEdit[j].getAttribute("questionnum2")
        );

        if (answersEdit[j].getAttribute("questionnum2") == questionNumTest) {
          answersArray.push({
            answerText: answersEdit[j].value,
            isCorrect: checkboxes[j].checked,
          });
        }
      }

      if (deleteCheckboxes[i].checked == false) {
        finalArray.push({
          question: editQuestions[i].value,
          answerOptions: answersArray,
        });
      } else {
        numDeleteCheckboxes++;
      }
    }

    firebase
      .database()
      .ref(`Quizzes/${currentUser}/${quizTitle}`)
      .set({
        updatedSortDate: new Date().toISOString(),

        NumQuestions: numQuestions - numDeleteCheckboxes,
        Title: quizTitle,
        creator: currentUser,
        dateCreated: savedDateCreated,
        timeCreated: savedTimeCreated,
        createdSortDate: savedCreatedSortDate,
      });

    var index = editQuestions.length;

    for (var i = 1; i < numQuestions - numDeleteCheckboxes + 1; i++) {
      var question = finalArray[i - 1];
      firebase.database().ref(`Quizzes/${currentUser}/${quizTitle}/${i}`).set({
        answerOptions: question.answerOptions,
        questionText: question.question,
      });
      console.log(question.question);
    }

    window.location.reload();
  }

  function updateTicked(answerIndex, questionIndex) {
    var checkboxes = document.getElementsByClassName("checkboxes");
    var i;

    for (i = 0; i < checkboxes.length; i++) {
      if (
        questionIndex ==
        document
          .getElementsByClassName("checkboxes")
          [i].getAttribute("questionnum2")
      ) {
        if (
          answerIndex ==
          document
            .getElementsByClassName("checkboxes")
            [i].getAttribute("answernum")
        ) {
          document.getElementsByClassName("checkboxes")[i].checked = true;
        } else {
          document.getElementsByClassName("checkboxes")[i].checked = false;
        }
      }
    }
  }

  function updateDelete(input) {
    var deleteCheckboxes = document.getElementsByClassName("deleteCheckboxes");
    var questionWidget = document.getElementsByClassName("questionWidget");
    var inputElements = [].slice.call(
      document.getElementsByClassName("deleteCheckboxes")
    );
    var checkedValue = inputElements.filter((chk) => chk.checked).length;

    if (deleteCheckboxes[input].checked == true) {
      if (deleteCheckboxes.length == 1 || checkedValue == numQuestions) {
        alert("Quiz needs at least one question");
        deleteCheckboxes[input].checked = false;
      } else {
        questionWidget[input].classList.add("red");
      }
    } else {
      questionWidget[input].classList.remove("red");
    }
  }

  function getAnswersArray() {
    var editQuestions = document.getElementsByClassName("editQuestions");
    var checkboxes = document.getElementsByClassName("checkboxes");
    var answersEdit = document.getElementsByClassName("answer");
    var deleteCheckboxes = document.getElementsByClassName("deleteCheckboxes");

    var finalArray = [];
    for (var i = 0; i < editQuestions.length; i++) {
      var questionNumTest = i;
      var answersArray = [];
      for (var j = 0; j < answersEdit.length; j++) {
        console.log(answersEdit[j]);
        console.log(
          "questionnum2: " + answersEdit[j].getAttribute("questionnum2")
        );

        if (answersEdit[j].getAttribute("questionnum2") == questionNumTest) {
          answersArray.push({
            answerText: answersEdit[j].value,
            isCorrect: checkboxes[j].checked,
          });
        }
      }

      finalArray.push(answersArray);
    }
    console.log(finalArray);
    return finalArray;
  }

  /* Other */

  function refreshResults() {
    setResponse([]);
  }

  return (
    <div className="container box">
      {editingMode ? (
        <div id="editingQuiz">
          <form id="editForm">
            <h1>{quizTitle}</h1>

            <div>
              <hr />
              {quizData.map((question, questionIndex) => (
                <div key={questionIndex} className="questionWidget">
                  <h3> {questionIndex + 1}. Question</h3>
                  <input
                    type="text"
                    questionnum={questionIndex}
                    id="editQuestion"
                    className="editQuestions"
                    defaultValue={question.questionText}
                  />
                  <br /> <br />
                  <h3>Answer Options</h3>
                  <div className="answerWidget">
                    {question.answerOptions.map((answer, i) => (
                      <div key={i}>
                        <input
                          answernum={i}
                          questionnum2={questionIndex}
                          className="answer"
                          type="text"
                          defaultValue={answer.answerText}
                        ></input>
                        <input
                          onChange={() => updateTicked(i, questionIndex)}
                          questionnum2={questionIndex}
                          id="myCheck"
                          answernum={i}
                          className="checkboxes"
                          type="checkbox"
                          defaultChecked={answer.isCorrect === true}
                        />
                      </div>
                    ))}
                  </div>
                  <label>Delete Question </label>{" "}
                  <input
                    onChange={() => updateDelete(questionIndex)}
                    type="checkbox"
                    className="deleteCheckboxes"
                  />
                  <br /> <br />
                  <hr />
                </div>
              ))}
            </div>
          </form>
          <Button onClick={toggleEditQuiz}>Exit Editing Mode</Button>

          <Button onClick={updateQuiz}>Submit Quiz</Button>
        </div>
      ) : (
        <div id="takingQuiz">
          {initial ? (
            <div id="initial">
              {quizTitle != null ? (
                <div>
                  <div id="title-section">
                    <h1 id="quiz-title">{quizTitle}</h1>
                  </div>
                  <div>
                    <h2>From {quizUser}</h2>
                  </div>
                  <div className="initial-button">
                    <Button
                      active
                      type="button"
                      onClick={handleStartButtonClick}
                      id="start-btn"
                      className="btn btn-lg btn-primary"
                    >
                      Start
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <span>Loading</span>
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}

          {quiz ? (
            <div id="mainPage">
              <h1 id="title">{quizTitle}</h1>
              <hr />

              <div id="question-container">
                <p id="question">{quizData[currentQuestion].questionText}</p>

                <div id="answer-buttons" className="answer-section">
                  {quizData[currentQuestion].answerOptions.map(
                    (answerOption, i) => (
                      <Button
                        key={i}
                        onClick={() =>
                          handleAnswerButtonClick(
                            answerOption.answerText,
                            answerOption.isCorrect
                          )
                        }
                        variant="primary"
                        size="lg"
                        className="answer-btn "
                      >
                        {answerOption.answerText}
                      </Button>
                    )
                  )}{" "}
                </div>
              </div>
              <hr />
              <div id="footer">
                <div id="hud">
                  {/* <div id="progressText" className="hud-prefix"></div> */}
                  <div id="progressText" className="hud-prefix">
                    Question {currentQuestion + 1} of {quizData.length}{" "}
                  </div>
                  <div id="progressBar">
                    <div id="progressBarFull"></div>
                  </div>
                </div>

                <div id="control-buttons" className="controls hud-prefix">
                  <Button
                    active
                    type="button"
                    onClick={handleCheckButtonClick}
                    id="check-btn"
                    className=" check-btn btn neutral hide"
                  >
                    Check
                  </Button>
                  <Button
                    active
                    type="button"
                    hidden
                    onClick={handleNextButtonClick}
                    id="next-btn"
                    className="next-btn btn neutral hide"
                  >
                    Next
                  </Button>
                  <Button
                    active
                    type="button"
                    hidden
                    onClick={handleFinishButtonClick}
                    id="finish-btn"
                    className="next-btn btn neutral hide"
                  >
                    Finish
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {end ? (
            <div id="end" className="">
              <h1>You have completed the Quiz</h1>
              <span>
                <span>
                  Your Score: You scored {score} out of {numQuestions}{" "}
                </span>
                <span id="score"></span>
              </span>

              <div className="controls">
                <Button
                  onClick={handleRestartButtonClick}
                  id="restart-btn"
                  className="restart-btn btn "
                >
                  Restart
                </Button>
                <Button
                  onClick={handleResultsButtonClick}
                  id="results-btn"
                  className="results-btn btn "
                >
                  Results
                </Button>
                <Button
                  onClick={handleHomeButtonClick}
                  id="home-btn"
                  className="home-btn btn"
                >
                  Go home
                </Button>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {results ? (
            <div id="new-results" className="result-box">
              <h1>Results</h1>
              <table>
                <thead>
                  <tr>
                    <td>Total Questions</td>
                    <td>
                      <span id="total-question">{quizData.length}</span>
                    </td>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Correct</td>
                    <td>
                      <span id="total-correct">{score}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Incorrect</td>
                    <td>
                      <span id="total-incorrect">
                        {quizData.length - score}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Percentage</td>
                    <td>
                      <span id="percentage">
                        {Number(
                          Number(score).toFixed(2) /
                            Number(quizData.length).toFixed(2)
                        ).toFixed(2) * 100}
                        %
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Total Score</td>
                    <td>
                      <span id="total-score">
                        {score} / {quizData.length}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table id="breakdown">
                <thead>
                  <tr>
                    <th>Questions</th>
                    <th>Your Answer</th>
                    <th>Correct Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {response.map((answer, i) => (
                    <tr className={answer.color} key={i}>
                      <td>{answer.question}</td>
                      <td>{answer.yourAnswer}</td>
                      <td>{answer.correctAnswer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Button
                active
                type="button"
                onClick={handleReturnEndButtonClick}
                id="toEndPage"
                className="toEndPage-btn btn"
              >
                Back to end page
              </Button>
            </div>
          ) : (
            <div></div>
          )}

          {isCreator ? (
            <div className="" id="creatorButtons">
              <Button id="editQuizButton" onClick={toggleEditQuiz}>
                Edit
              </Button>
              <Button id="deleteQuizButton" onClick={(e) => removeQuiz(e)}>
                Delete
              </Button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
}
