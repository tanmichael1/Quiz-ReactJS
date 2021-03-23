// export function displayQuizList(){

// }

/**
 * This is the Quizzes Screen.
 */
import React, { useState } from "react";
import { firebase } from "../Config";

//Get Quizzes
//Each user - each quiz

//Put each quiz in an array of quizzes - title for now
//Sort quizzes in alphabetical order by title for now

//Link them and post the information there

/**
 *
 * This screen shows the posts of all users.
 *
 */
export default function Quizzes() {
  const [array, setArray] = useState([]);
  const [calledFunction, setCalledFunction] = useState(false);
  const [profilePicURL, setProfilePicURL] = useState("");
  const [done, setDone] = useState(false);
  const [titleArray, setTitleArray] = useState([]);
  const [quizArray, setQuizArray] = useState([]);

  const quizzesRef = firebase.database().ref("Quizzes");

  if (!done) {
    quizzesRef.on("value", (snap) => console.log(snap.val()));

    quizzesRef.on("value", (snap) =>
      //childsnapshot - each user
      snap.forEach((childSnapshot) => {
        //Each element
        console.log(childSnapshot.val());
        childSnapshot.forEach((element) => {
          //element - each quiz
          console.log(element.val());
          console.log(element.val().Title);
          var tempArray = titleArray;
          var newTitle = element.val().Title;
          var questions = addQuestions(element);
          tempArray.push({ test: newTitle });
          setTitleArray(tempArray);
          console.log(titleArray);
          console.log(titleArray.length);
          var currentArray = quizArray;
          setQuizArray(currentArray.push({ title: newTitle, questions }));

          console.log(quizArray);
        });
      })
    );

    setDone(true);
  }

  //Get Quizzes
  //Each user - each quiz

  function addQuestions(snapshot) {
    var questionsArray = [];
    console.log(snapshot.val());
    var count = snapshot.val().NumQuestions;
    var testTitle = snapshot.child("Title").val();
    console.log(testTitle);

    for (var i = 0; i < count; i++) {
      questionsArray.push(loadQuestions(snapshot.child(i + 1).val()));
    }
    return questionsArray;
  }

  function loadQuestions(quiz: object) {
    var answerOptionsData = quiz.answerOptions;
    // console.log(answerOptionsData);
    var array = [];
    console.log(quiz.questionText);
    //// currentResponse.push({question:
    //quizData[currentQuestion].questionText, yourAnswer:currentAnswer, correctAnswer: trueAnswer, color: "green"});

    array.push({
      questionText: quiz.questionText,
      answerOptions: answerOptionsData,
    });
    console.log(array);
    return array;
  }

  /**
   * Returns an array of all the posts in the correct order.
   * @param snapshot All the posts
   */
  function databaseArray(snapshot) {
    let returnArr = [];
    let keyArr = [];

    snapshot.forEach((childSnapshot) => {
      var num = 0;
      childSnapshot.forEach((element) => {
        var key = Object.keys(childSnapshot.val())[num];

        if (!keyArr.includes(key)) {
          keyArr.push(key);
          var name_val = element.val().username;
          var captionVal = element.val().caption;
          var imgLocation = element.val().imgLocation;
          var time = element.val().time;
          var date = element.val().date;
          var sortDate = element.val().sortDate;
          var likes = element.val().likes;
          var imgRef = firebase.storage
            .ref()
            .child("ProfilePictures/" + name_val);

          imgRef.getDownloadURL().then(function (url) {
            if (profilePicURL != url) {
              setProfilePicURL(url);
            }
          });

          var profilePic = profilePicURL;

          returnArr.push({
            key: key,
            name: name_val,
            caption: captionVal,
            imgLocation: imgLocation,
            date: date,
            time: time,
            sortDate: sortDate,
            likes: likes,
            profilePic: profilePicURL,
          });
          num = num + 1;
        }
      });
    });
    returnArr.sort((a, b) => a.sortDate.localeCompare(b.sortDate));

    returnArr.reverse();

    return returnArr;
  }

  return (
    <div className="container">
      <h1>Welcome to Quizzes</h1>

      {done ? (
        <div>
          {titleArray.map((title) => (
            <div>{title.test}</div>
          ))}
        </div>
      ) : (
        <div>No quizzes</div>
      )}
    </div>
  );
}
