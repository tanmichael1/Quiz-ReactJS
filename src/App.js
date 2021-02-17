import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import {firebase} from './Config';


const preObject = document.getElementById('object');
const preUsers = document.getElementById('Users');

export default function App() {
  const [done, setDone] = useState(false);
  const [test, setTest] = useState(null);
  const [initial, setInitial] = useState(true);
  const [quiz, setQuiz] = useState(false);
  const [end, setEnd] = useState(false);
  const [results, setResults] = useState(false);
  
  const dbRefObject = firebase.database().ref().child('object');  
  const dbRefUsers = firebase.database().ref("Users"); 

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
  setDone(true);
  }

  function loadQuestions(quiz: object){

  }
  
  function handleStartButtonClick(){
    console.log("press");
    setInitial(false);
    setQuiz(true);
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
    <div className="App">

      {initial ? (
     <div>
     <div className="container" id="initial">  
      <div id="title-section" >
            <h1 id="quiz-title" >The Ultimate Quiz</h1>        
        </div>

      </div>
      <div className="initial-button">
  
            <button onClick={handleStartButtonClick} id="start-btn" className="start-btn btn neutral">Start</button>   
        </div>
        </div>  ) : (
          <br></br>
        )
      }

{quiz ? (
     <div id="mainPage" className="container hide">
     <h1 id="title">Quiz</h1>
     <hr></hr>
     
    
     <div id="question-container" >
         <p id="question">Question</p>
        
         <div id="answer-buttons" >
                 <button className="question-btn neutral">Answer 1</button>
                 <button className="question-btn neutral">Answer 2</button>                
             <button className="question-btn neutral">Answer 3</button>
             <button className="question-btn neutral">Answer 4</button>
         </div>
     </div>
     <hr></hr>
     <div id="footer">
         <div id="hud">
        
            
             <div id="progressText" className="hud-prefix">
     
             </div>
 <div id="progressBar">
     <div id="progressBarFull"></div>
 
 </div>

     </div>
     
     <div id="control-buttons" className="controls hud-prefix">
         <button onClick={handleCheckButtonClick} id="check-btn" className="check-btn btn neutral hide">Check</button>
         <button onClick={handleNextButtonClick} id="next-btn" className="next-btn btn neutral hide">Next</button>  
     </div>   
     

 
</div> 
</div>) : (
          <div></div>
        )
      }


{end ? (
     <div id="end" className="container hide">
     <h1>You have completed the Quiz</h1>
         <span  >
            
                 <span >Your Score: </span>     
         <span id="score"></span> 
         </span>
   
   

     <div className="controls">
         <button onClick={handleRestartButtonClick} id="restart-btn" className="restart-btn btn ">Restart</button>
         <button onClick={handleResultsButtonClick} id="results-btn" className="results-btn btn ">Results</button>
         <button onClick={handleHomeButtonClick} id="home-btn" className="home-btn btn">Go home</button>
     </div>


 </div>  ) : (
          <div></div>
        )
      }

{results ? (
     <div id="new-results" className="result-box container hide">
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

     <table id="breakdown">
       <thead>
         <tr>
             <th>Questions</th>
             <th>Your Answer</th>
             <th>Correct Answer</th>
         </tr>
       </thead>
         
         
         
     </table>

     <button onClick={handleReturnEndButtonClick} id="toEndPage" className="toEndPage-btn btn">Back to end page</button>
 </div>  ) : (
          <div></div>
        )
      }
      
      
      
    </div>
    
  );
}


