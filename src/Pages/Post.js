import "../App.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { firebase } from "./../Config";

export default function Post() {
  const [done, setDone] = useState(false);
  const [numQuestions, setNumQuestions] = useState(0);
  const [currentUser, setCurrentUser] = useState();
  const [currentUserID, setCurrentUserID] = useState();
  const [isCreator, setIsCreator] = useState(false);
  const [editingMode, setEditingMode] = useState(false);

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

  const handleAnswerButtonClick = (text, isCorrect) => {
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
        // button.classList.add('marked');
      } else {
        // button.classList.remove('marked');
      }
    });
  };

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

    dbTestQuiz.on("value", function (quizSnapshot) {
      var count = quizSnapshot.child("NumQuestions").val();
      console.log(quizSnapshot.val());
      setNumQuestions(count);
      setSavedDateCreated(quizSnapshot.child("dateCreated").val());
      setSavedTimeCreated(quizSnapshot.child("timeCreated").val());
      setSavedCreatedSortDate(quizSnapshot.child("createdSortDate").val());

      for (var i = 0; i < count; i++) {
        loadQuestions(quizSnapshot.child(i + 1).val());
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
        dbRefUsers.on("value", function (snap) {
          console.log("snap.val(): " + snap.val());
          console.log("quizUser: " + currUser);
          setCurrentUser(snap.val());
          if (snap.val() === currUser) {
            // document
            //   .getElementById("creatorButtons")
            //   .classList.remove("hidden");
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

  function handleStartButtonClick() {
    setInitial(false);
    setQuiz(true);
  }

  function handleCheckButtonClick() {
    const answerButtonsElement = document.getElementById("answer-buttons");

    if (selected) {
      //Check
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

          //Save button
          // button.classList.add('marked');
        } else {
          if (button.innerHTML === trueAnswer) {
            button.classList.add("correct");
          }
          // button.classList.remove('marked');
        }
      });

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
    setSelected(false);
    document.getElementById("next-btn").hidden = true;
    document.getElementById("check-btn").hidden = false;
    refreshButtons();

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      console.log(currentQuestion);
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
    });
  }

  function handleFinishButtonClick() {
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

  function refreshResults() {
    setResponse([]);
  }

  function updateQuiz() {
    var editQuestions = document.getElementsByClassName("editQuestions");
    var checkboxes = document.getElementsByClassName("checkboxes");
    var answersEdit = document.getElementsByClassName("answer");

    var finalArray = [];
    for (var i = 0; i < editQuestions.length; i++) {
      var questionNumTest = i;
      var answersArray = [];
      for (var j = 0; j < answersEdit.length; j++) {
        console.log(answersEdit[j]);
        console.log(
          "questionnum2: " + answersEdit[j].getAttribute("questionnum2")
        );
        console.log("questionNumTest: " + questionNumTest);
        // console.log("checkboxes[j].value: " + checkboxes[j].value);
        if (answersEdit[j].getAttribute("questionnum2") == questionNumTest) {
          answersArray.push({
            answerText: answersEdit[j].value,

            isCorrect: checkboxes[j].checked,
          });
          console.log(answersArray);
          console.log(answersEdit);
        }
      }

      finalArray.push({
        question: editQuestions[i].innerHTML,
        answerOptions: answersArray,
      });
    }

    console.log(finalArray);
    firebase.database().ref(`Quizzes/${currentUser}/${quizTitle}`).set({
      updatedSortDate: new Date().toISOString(),

      NumQuestions: numQuestions,
      Title: quizTitle,
      creator: currentUser,
      dateCreated: savedDateCreated,
      timeCreated: savedTimeCreated,
      createdSortDate: savedCreatedSortDate,
    });

    var index = editQuestions.length;

    for (var i = 1; i < index + 1; i++) {
      console.log(i);
      var question = finalArray[i - 1];
      console.log(question);
      console.log(question.answerOptions);
      console.log(question.question);
      firebase.database().ref(`Quizzes/${currentUser}/${quizTitle}/${i}`).set({
        answerOptions: question.answerOptions,
        questionText: question.question,
      });
    }

    window.location.reload();
  }

  function updateTicked(checkbox, input, questionIndex) {
    console.log("HEREEEEEEEEEEEEEEE");
    var currentInput = input;
    var checkboxes = document.getElementsByClassName("checkboxes");
    var i;
    //Identify the correct boxes first
    //input - index of the answers in answer options
    //questionIndex - index of the question

    for (i = 0; i < checkboxes.length; i++) {
      //console.log(currentInput);
      //console.log(i);
      console.log("questionIndex: " + questionIndex);
      console.log(
        document
          .getElementsByClassName("checkboxes")
          [i].getAttribute("questionnum2")
      );

      if (
        questionIndex ==
        document
          .getElementsByClassName("checkboxes")
          [i].getAttribute("questionnum2")
      ) {
        if (
          currentInput ==
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

  return (
    <div id="box" className="container">
      {editingMode ? (
        <div id="editingQuiz">
          <form id="editForm">
            <h1>Quiz</h1>
            <div>
              {quizData.map((question, questionIndex) => (
                <div>
                  <h1
                    questionnum={questionIndex}
                    id="editQuestion"
                    className="editQuestions"
                  >
                    {question.questionText}
                  </h1>
                  {question.answerOptions.map((answer, i) => (
                    <div>
                      <input
                        answernum={i}
                        questionnum2={questionIndex}
                        className="answer"
                        type="text"
                        defaultValue={answer.answerText}
                      ></input>
                      <input
                        onChange={(e) => updateTicked(e, i, questionIndex)}
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
                        className="question-btn "
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
                  <div id="progressText" className="hud-prefix"></div>
                  <div>
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
                    className="check-btn btn neutral hide"
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
