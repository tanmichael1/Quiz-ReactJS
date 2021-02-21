import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {firebase} from './Config';


const preObject = document.getElementById('object');
const preUsers = document.getElementById('Users');

export default function App() {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState(["test"]);
  const [done, setDone] = useState(false);

  const [test, setTest] = useState(null);
  const [initial, setInitial] = useState(true);
  const [quiz, setQuiz] = useState(false);
  const [end, setEnd] = useState(false);
  const [results, setResults] = useState(false);
  const current = questions[index];

  function databaseQuestions(snapshot) {
    let returnArr = [];
    let keyArr = [];

    snapshot.forEach((childSnapshot) => {
      var num = 0;

      childSnapshot.forEach((element) => {
        var key = Object.keys(childSnapshot.val())[num];
        console.log(element.val());

        if (!keyArr.includes(key)) {
          keyArr.push(key)
          var text = element.val();
        returnArr.push({text: text});

        }
        
      });

      

    });
   
    return returnArr;


  }

  const ref = firebase.database().ref();
  
  const dbRefObject = firebase.database().ref().child('object');  
  const dbRefUsers = firebase.database().ref("Users"); 

  const dbTestQuiz = ref.child('Quizzes/TestUser/TestQuiz');
  const dbTestQuizQuestions = ref.child('Quizzes/TestUser/TestQuiz/Questions');
  

  if(!done){
    dbRefObject.on('value', snap => 
  console.log(snap.val())
  );

  dbRefUsers.on('value', snap => 
  //Each user
  snap.forEach(childSnapshot => {
    //Each element
    console.log(childSnapshot.val());
    childSnapshot.forEach((element) => {
      console.log(element.val())
    })
  })

  );


  dbRefObject.on('value', snap => 
  setTest(snap.val())
  );

  dbTestQuiz.on('value', function(quizSnapshot){
    var count = quizSnapshot.child("NumQuestions").val();
    var questions = dbTestQuizQuestions.once("value").then(function(snapshot){
      // console.log(snapshot.val())
      setQuestions(databaseQuestions(snapshot));
    });
    // console.log(count);
  });
  
  
  setDone(true);
  }

  function loadQuestions(quiz: object){

  }
  
  function handleStartButtonClick(){
    console.log(questions);
    console.log("press");
    setInitial(false);
    setQuiz(true);
    updateQuestion();
  }

  function updateQuestion(){
    console.log(questions[0].text);
    // setIndex(index++);
    var question = document.getElementById('question');
    // question.innerText = questions;
  }

  function handleCheckButtonClick(){

  }

  function handleNextButtonClick(){
    console.log("press");

    setQuiz(false);
    setEnd(true)
  }

  function handleEndButtonClick(){
    console.log("press");

    setQuiz(false);
    setEnd(true)
  }

  function handleHomeButtonClick(){
    console.log("press");

    setInitial(true);
    setEnd(false)
  }

  function handleResultsButtonClick(){
    console.log("press");

    setResults(true);
    setEnd(false)
  }

  function handleRestartButtonClick(){
    setEnd(false);
    setQuiz(true);
  }
  function handleReturnEndButtonClick(){
    console.log("press");

    setResults(false);
    setEnd(true)
  }

  

  return (
    <div className="App" >
      <h1 id="mobile">Mobile sized</h1>

      <div id="box" className="container">

      {initial ? (
   
     <div id="initial">  
      <div id="title-section" >
            <h1 id="quiz-title" >The Ultimate Quiz</h1>        
      </div>
<div className="initial-button">
  
            <Button active type="button" onClick={handleStartButtonClick} id="start-btn" 
            className="btn btn-lg btn-primary"
            >Start</Button>   
        </div>
      </div>
        ) : (
          <div></div>
        )
      }

{quiz ? (
     <div id="mainPage" >
     <h1 id="title">The Ultimate Quiz</h1>
     <hr />
     
    
     <div id="question-container" >
         <p id="question">{current.text}</p>
        
         <div id="answer-buttons" >
                 <Button variant="primary" size="lg" block className="question-btn neutral">Answer 1</Button>
                 <Button variant="primary" size="lg" block className="question-btn neutral">Answer 2</Button>                
             <Button variant="primary" size="lg" block className="question-btn neutral">Answer 3</Button>
             <Button variant="primary" size="lg" block className="question-btn neutral">Answer 4</Button>
         </div>
     </div>
     <hr />
     <div id="footer">
         <div id="hud">
        
            
             <div id="progressText" className="hud-prefix">
     
             </div>
 <div id="progressBar">
     <div id="progressBarFull"></div>
 
 </div>

     </div>
     
     <div id="control-buttons" className="controls hud-prefix">
         <Button active type="button"  onClick={handleCheckButtonClick} id="check-btn" className="check-btn btn neutral hide">Check</Button>
         <Button active type="button"  onClick={handleNextButtonClick} id="next-btn" className="next-btn btn neutral hide">Next</Button>  
     </div>   
     

 
</div> 
</div>) : (
          <div></div>
        )
      }


{end ? (
     <div id="end" className="">
     <h1>You have completed the Quiz</h1>
         <span  >
            
                 <span >Your Score: </span>     
         <span id="score"></span> 
         </span>
   
   

     <div className="controls">
         <Button onClick={handleRestartButtonClick} id="restart-btn" className="restart-btn btn ">Restart</Button>
         <Button onClick={handleResultsButtonClick} id="results-btn" className="results-btn btn ">Results</Button>
         <Button onClick={handleHomeButtonClick} id="home-btn" className="home-btn btn">Go home</Button>
     </div>


 </div>  ) : (
          <div></div>
        )
      }

{results ? (
     <div id="new-results" className="result-box">
     <h1>Results</h1>
     <table>
       <thead>
         <tr>
             <td>Total Questions</td>
             <td><span id="total-question">5</span></td>
         </tr>
       </thead>

       <tbody>
          <tr>
             <td>Correct</td>
             <td><span id="total-correct">5</span></td>
         </tr>
         <tr>
             <td>Incorrect</td>
             <td><span id="total-incorrect">5</span></td>
         </tr>
         <tr>
             <td>Percentage</td>
             <td><span id="percentage">60%</span></td>
         </tr>
         <tr>
             <td>Total Score</td>
             <td><span id="total-score">1 / 3</span></td>
         </tr>
       </tbody>
         
        
     </table>

     <table  id="breakdown">
       <thead>
         <tr>
             <th>Questions</th>
             <th>Your Answer</th>
             <th>Correct Answer</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td>What is 3/5 of 100?</td>
           <td>60</td>
           <td>60</td>
         </tr>
         
       </tbody>
         
         
         
     </table>

     <Button active type="button"   onClick={handleReturnEndButtonClick} id="toEndPage" className="toEndPage-btn btn">Back to end page</Button>
 </div>  ) : (
          <div></div>
        )
      }

</div>

     
      
      
      
    </div>
    
  );
}


