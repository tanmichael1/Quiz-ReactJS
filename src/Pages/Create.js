import React, { useState } from "react";
import { firebase } from "./../Config";
import Widget from "./components/AddQuestionWidget";

export default function Create() {
  const [done, setDone] = useState(false);
  const [numAnswers, setNumAnswers] = useState(["Answer 1", "Answer 2"]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [currentUserID, setCurrentUserID] = useState();
  const [quizTitles, setQuizTitles] = useState([]);
  const [admin, setAdmin] = useState(false);

  const [notes, setNotes] = useState([]);

  if (!done) {
    setup();
    setDone(true);
  }

  function deleteQuestion(id) {
    setSavedQuestions((prevQuestions) => {
      return prevQuestions.filter((noteItem, index) => {
        return index !== id;
      });
    });
    setDisplayQuestions((prevQuestions) => {
      return prevQuestions.filter((noteItem, index) => {
        return index !== id;
      });
    });
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
    console.log(savedQuestions.length);

    checkNumQuestions();
  }
  function setup() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const dbRefUsersName = firebase
          .database()
          .ref("Users/" + user.uid + "/username");
        console.log(user);
        const dbRefUsers = firebase.database().ref(`Users/${user.uid}`);
        dbRefUsers.on("value", (user) => {
          if (user.val().admin == undefined || user.val().admin == false) {
            console.log("undefined or not admin");
          } else {
            setAdmin(true);
          }
        });

        setCurrentUserID(user.uid);
        dbRefUsersName.on("value", function (snap) {
          setCurrentUser(snap.val());
          console.log(snap.val());
        });
      } else {
        alert("Must have be logged in to create a quiz");
        window.location = "/";
      }
    });
    const quizzesRef = firebase.database().ref("Quizzes");

    quizzesRef.on("value", (snap) =>
      snap.forEach((user) => {
        var currentArray = quizTitles;

        user.forEach((quiz) => {
          var newTitle = quiz.val().Title;

          currentArray.push(newTitle);
          currentArray.sort(function (a, b) {
            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          });
          setQuizTitles(currentArray);
        });
      })
    );
  }

  //Checks that quiz doesn't already exist

  function checkTitle() {
    if (quizTitles.includes(document.getElementById("upload-title").value)) {
      return true;
    } else {
      return false;
    }
  }

  function submitQuiz() {
    var title = document.getElementById("upload-title").value;

    if (title == null || title == "") {
      alert("Requires a title");
    } else if (savedQuestions.length == 0) {
      alert("Need at least one question before submitting");
    } else if (checkTitle()) {
      alert("Quiz title already used, please other title");
    } else {
      //Add quiz
      const dbQuizForUser = firebase
        .database()
        .ref("Users/" + currentUserID + "/createdQuizzes/" + title);

      dbQuizForUser.set({ title: title });

      firebase
        .database()
        .ref(`Quizzes/${currentUser}/${title}`)
        .set({
          NumQuestions: savedQuestions.length,
          Title: title,
          creator: currentUser,
          dateCreated: new Date().toLocaleDateString("en-NZ"),
          timeCreated: new Date().toLocaleTimeString("en-NZ"),
          createdSortDate: new Date().toISOString(),
          updatedSortDate: new Date().toISOString(),
          testQuiz: document.getElementById("testQuiz").checked,
        });

      //Each question

      var index = savedQuestions.length;

      for (var i = 1; i < index + 1; i++) {
        var questionArray = savedQuestions;

        var question = questionArray[i - 1];
        console.log(answerOptions);
        firebase
          .database()
          .ref(`Quizzes/${currentUser}/${title}/${i}`)
          .set({
            answerOptions: answerOptions[i - 1],
            questionText: question,
          });
      }

      setNotes([]);

      const createQuizForm = document.querySelector("#createQuizForm");
      createQuizForm.reset();
      alert("Your quiz has been submitted");
    }
  }

  function checkCheckboxes() {
    var checkboxes = document.getElementsByClassName("checkboxes");
    var i;

    for (i = 0; i < checkboxes.length; i++) {
      if (document.getElementsByClassName("checkboxes")[i].checked == true) {
        return true;
      }
    }
    return false;
  }

  function addQuestion(e) {
    e.preventDefault();

    var checkboxes = document.getElementsByClassName("checkboxes");

    let newQuestion = document.getElementById("upload-question").value;
    if (newQuestion == null || newQuestion == "") {
      alert("Needs a question");
    } else if (!checkCheckboxes()) {
      alert("Must specify which option is correct");
    }
    //Check that correct Index is valid value
    else {
      //Save answer options
      var answerArray = [];
      var displayArray = [];
      var newSavedAnswers = answerOptions;
      var x = document.getElementsByClassName("Answer");

      var i;

      //If less than 2 options are filled in
      var min2Options = false;
      var numOptionsCount = 0;

      //If correct answer is blank
      var validAnswer = false;

      for (i = 0; i < x.length; i++) {
        if (x[i].value != "" && x[i].value != null) {
          numOptionsCount++;
          console.log(numOptionsCount);
          if (
            document.getElementsByClassName("checkboxes")[i].checked == true
          ) {
            if (x[i].value != "") {
              validAnswer = true;
            }
            answerArray.push({ answerText: x[i].value, isCorrect: true });
            displayArray.push({ answerText: x[i].value, color: "green" });
          } else {
            answerArray.push({ answerText: x[i].value, isCorrect: false });
            displayArray.push({ answerText: x[i].value, color: "red" });
          }
        }
      }

      if (numOptionsCount >= 2) {
        min2Options = true;
      }

      if (min2Options) {
        if (validAnswer) {
          console.log(displayArray);
          newSavedAnswers.push(answerArray);

          console.log(answerArray);
          console.log(newSavedAnswers);
          //setAnswerOptions(newSavedAnswers);

          //Save question
          var currentQuestions = savedQuestions;
          currentQuestions.push(newQuestion);

          //Display questions

          var tempQuestions = displayQuestions;
          tempQuestions.push({
            question: newQuestion,
            answerOptions: displayArray,
          });

          setNotes(tempQuestions);
          document.getElementById("addQuestions").reset();
          setNumAnswers(["Answer 1", "Answer 2"]);
        } else {
          alert("Chosen correct answer is blank");
        }
      } else {
        alert("Need to fill in at least 2 options");
      }
      document.getElementById("savedQuestionsTitle").classList.remove("hidden");
    }
  }

  function addAnswerOption(e) {
    e.preventDefault();
    var length = numAnswers.length;
    if (length == 2) {
      setNumAnswers(["Answer 1", "Answer 2", "Answer 3"]);
    } else if (length == 3) {
      setNumAnswers(["Answer 1", "Answer 2", "Answer 3", "Answer 4"]);
    }
  }

  function updateTicked(checkbox, input) {
    var currentInput = input;
    var checkboxes = document.getElementsByClassName("checkboxes");
    var i;

    for (i = 0; i < checkboxes.length; i++) {
      if (input == i) {
        document.getElementsByClassName("checkboxes")[i].checked = true;
      } else {
        document.getElementsByClassName("checkboxes")[i].checked = false;
      }
    }
  }

  function checkNumQuestions() {
    if (notes.length <= 1) {
      document.getElementById("savedQuestionsTitle").classList.add("hidden");
    } else {
      document.getElementById("savedQuestionsTitle").classList.remove("hidden");
    }
    console.log(notes.length);
  }

  function test(e) {
    e.preventDefault();
    console.log(document.getElementById("testQuiz").checked);
  }

  return (
    <div className="container box">
      <h1>Create Quiz</h1>
      <hr />

      <form id="createQuizForm">
        <div>
          <h3>Title</h3>
          <input
            required
            type="text"
            className="form-control"
            id="upload-title"
            placeholder="Enter quiz title"
          />
        </div>

        <div>
          <h2 className="hidden" id="savedQuestionsTitle">
            Saved Questions
          </h2>
          {notes.map((noteItem, index) => {
            return (
              <Widget
                key={index}
                answers={noteItem.answerOptions}
                question={noteItem.question}
                id={index}
                onDelete={deleteQuestion}
              />
            );
          })}
        </div>

        <hr />

        <div>
          <h2>Add Questions</h2>
          <form id="addQuestions">
            <div>
              <h3>Question</h3>
              <input
                type="text"
                className="form-control"
                id="upload-question"
                placeholder="Enter question"
              />
              <br />
              <br />
            </div>

            <div>
              <h3>Answer Options</h3>
              {numAnswers.map((answer, i) => (
                <div className="answerOption">
                  <input
                    key={i}
                    type="text"
                    className="form-control Answer"
                    id="answer"
                    placeholder="Answer"
                  />
                  {"  "}
                  <input
                    type="checkbox"
                    id="answerCheckbox"
                    onChange={(e) => updateTicked(e, i)}
                    answernum={i}
                    className="checkboxes"
                    type="checkbox"
                  />
                  <br /> <br />
                </div>
              ))}

              {numAnswers.length < 4 ? (
                <>
                  <button
                    id="addAnswerOption"
                    onClick={(e) => addAnswerOption(e)}
                    className="btn btn-secondary"
                  >
                    Add Answer Option
                  </button>
                  <br />

                  <br />
                </>
              ) : (
                <div></div>
              )}
            </div>
            <button
              id="addQuestionID"
              onClick={(e) => addQuestion(e)}
              className=" btn btn-primary"
            >
              Save Question
            </button>
            <button className="hidden" onClick={(e) => test(e)}>
              Test Quiz Button
            </button>
            <br />

            {admin ? (
              <div>
                <label>Test Quiz </label>
                <input id="testQuiz" type="checkbox" />{" "}
              </div>
            ) : (
              <div></div>
            )}
          </form>
        </div>
      </form>
      <br />
      <hr />
      <button onClick={() => submitQuiz()} className="btn btn-success">
        Submit Quiz
      </button>
    </div>
  );
}
