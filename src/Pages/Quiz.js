
 import '../App.css';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {firebase} from './../Config';


const preObject = document.getElementById('object');
const preUsers = document.getElementById('Users');

export function editQuiz(){

}

export function removeQuiz(){

}

export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState(["test"]);
  const [answers, setAnswers] = useState(["test"]);
  const [done, setDone] = useState(false);

  const [test, setTest] = useState(null);
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
  const [selectedButton, setSelectedButton] = useState(0);

  const [quizData, setQuizData] = useState([]);
  const [quizUser, setQuizUser] = useState();
  const [quizTitle, setQuizTitle] = useState(null);


  const testQuestions = [
    {
      questionText: 'What is 3/5 of 100?',
      answerOptions: [
        {answerText: "4", isCorrect: false},
        {answerText: "5", isCorrect: false},
        {answerText: "20", isCorrect: false},
        {answerText: "60", isCorrect: true}
      ]
    },
    {
      questionText: 'If David’s age is 27 years old in 2011, what was his age in 2003?',
      answerOptions: [
        { answerText: '17 years', isCorrect: false },
        { answerText: '37 years', isCorrect: false },
        { answerText: '20 years', isCorrect: false },
        { answerText: '19 years', isCorrect: true }
      ]
    }
  ];

  const handleAnswerButtonClick = ( text, isCorrect) => {
    // console.log(button);
    const answerButtonsElement = document.getElementById('answer-buttons');
    setCurrentAnswer(text);
    setCorrect(isCorrect);


    quizData[currentQuestion].answerOptions.forEach((answer) => {
      if(answer.isCorrect){
        setTrueAnswer(answer.answerText);
      }

      if(answer.answerText==text){
        console.log(answer);
        
      }

    });
    setSelected(true);



    

    Array.from(answerButtonsElement.children).forEach(button => {
      console.log(currentAnswer);
      
      if(text==button.innerHTML){
        //Save button
          // button.classList.add('marked');
          
        

      }

      else{
          // button.classList.remove('marked');
      }
  });

 
    
    
    
  }
  
    

  // const highlight


  const current = questions[index];
  
  // const answerButtonsElement = document.getElementById('answer-buttons');

  

  // function databaseQuestions(snapshot) {
  //   let returnArr = [];
  //   let keyArr = [];

  //   snapshot.forEach((childSnapshot) => {
  //     var num = 0;

  //     childSnapshot.forEach((element) => {
  //       var key = Object.keys(childSnapshot.val())[num];
  //       console.log(element.val());

  //       if (!keyArr.includes(key)) {
  //         keyArr.push(key)
  //         var text = element.val();
  //       returnArr.push({text: text});

  //       }
  //       num = num + 1;
        
  //     });

      

  //   });
   
  //   return returnArr;


  // }

  // function databaseAnswers(snapshot) {
  //   let returnArr = [];
  //   let keyArr = [];

  //   //each lot of answers
  //   snapshot.forEach((childSnapshot) => {
  //     var num = 0;
      
  //     //each answer
  //     let newArr = [];
  //     var numQuestion = 0;
  //     childSnapshot.forEach((element) => {
        
        
  //       // var key = Object.keys(childSnapshot.val())[num];
        

  //       //  if (!keyArr.includes(key)) {
  //         // keyArr.push(key)
       
  //         var text = element.val().Text;
          
  //         var correct = element.val().Correct;
        

  //       //  }
  //       newArr.push({text: text, correct:correct});
  //       console.log(newArr);
        
        
  //     });
  //     returnArr.push(newArr);
  //     console.log("returnArr");
  //     console.log(returnArr);
  //     num = num + 1;
      

  //   });
  //   console.log(returnArr);
   
  //   return returnArr;


  // }

  /* firebase */

  

  const ref = firebase.database().ref();
  
  const dbRefObject = firebase.database().ref().child('object');  
  const dbRefUsers = firebase.database().ref("Users"); 

  const dbTestQuiz = ref.child('Quizzes/TestUser/TestQuiz');
  const dbTestQuizQuestions = ref.child('Quizzes/TestUser/TestQuiz/Questions');
  const dbTestQuizAnswers = ref.child('Quizzes/TestUser/TestQuiz/Answers');

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
    var testTitle = quizSnapshot.child("Title").val();
    console.log(testTitle);
    setQuizTitle(testTitle);
    console.log(count);
    for(var i=0; i<count; i++){
      loadQuestions(quizSnapshot.child(i+1).val());

    }
  });
  
  
  setDone(true);
  }

  function loadQuestions(quiz: object){
    console.log(quiz);
    //var 
    var answerOptionsData = quiz.answerOptions;
    console.log(answerOptionsData);
    var array = quizData;
    console.log(quiz.questionText);


    array.push({questionText: quiz.questionText, answerOptions: answerOptionsData});
    setQuizData(array);

  }
  
  function handleStartButtonClick(){
    console.log(questions);
    console.log("press");
    setInitial(false);
    setQuiz(true);
    // updateQuestion();
  }

  function updateQuestion(){
    
    console.log(questions[0].text);
    // setIndex(index++);
    var question = document.getElementById('question');
    // var answers = answers[0];
    console.log("answers");
    var tempAnswers = answers[0];
    console.log(tempAnswers);
    // tempAnswers.forEach(answer => {
    //   const button = document.createElement('button');
    //     button.innerText = answer.text;
    //     button.classList.add('question-btn');
    //     if(answer.correct){
    //         button.dataset.correct = answer.correct;

    //     }
    //     // button.addEventListener('click', markAnswer);
    //     if(answerButtonsElement!=null){

    //     answerButtonsElement.appendChild(button);
    //     }

    // });

    for(var i=0; i<tempAnswers.length; i++){
      const button = document.createElement('button');
        button.innerText = tempAnswers[i].text;
        button.classList.add('question-btn');
        if(tempAnswers[i].correct){
            button.dataset.correct = tempAnswers[i].correct;

        }
        // button.addEventListener('click', markAnswer);
        // if(answerButtonsElement!=null){

        // answerButtonsElement.appendChild(button);
        // }

    }


    // question.innerText = questions;
  }

  function handleCheckButtonClick(){
    const answerButtonsElement = document.getElementById('answer-buttons');
 
    if(selected){


    
      //Check
    var currentResponse = response;

    if(correct){
      setScore(score+1);
      currentResponse.push({question: quizData[currentQuestion].questionText, yourAnswer:currentAnswer, correctAnswer: trueAnswer, color: "green"});
     
    }

    else{
      currentResponse.push({question: quizData[currentQuestion].questionText, yourAnswer:currentAnswer, correctAnswer: trueAnswer, color:"red"});
    }

    
    setResponse(currentResponse);

    // setCurrentAnswer(null);

      
    Array.from(answerButtonsElement.children).forEach(button => {
      console.log(currentAnswer);
      
      if(currentAnswer==button.innerHTML){
        if(currentAnswer==trueAnswer){
          button.classList.add('correct');
        }

        else{
          button.classList.add('incorrect');
        }
        
        
        //Save button
          // button.classList.add('marked');
          
        

      }

      else{
        if(button.innerHTML==trueAnswer){
          button.classList.add('correct');
        }
          // button.classList.remove('marked');
      }
  });

      const nextQuestion = currentQuestion + 1;
    document.getElementById('check-btn').hidden = true;
    if(nextQuestion < quizData.length){
      
      document.getElementById('next-btn').hidden = false;
    }

    else{
      document.getElementById('finish-btn').hidden = false;
    }
    }
    

  }

  

  function handleNextButtonClick(){
    setSelected(false);
    document.getElementById('next-btn').hidden = true;
    document.getElementById('check-btn').hidden = false;
    refreshButtons();

    const nextQuestion = currentQuestion + 1;
    if(nextQuestion < quizData.length){
      setCurrentQuestion(nextQuestion);
      console.log(currentQuestion);
    }

    else{
      alert("You have reached the end of the quiz");
      handleNextButtonClick();
    }
    
    
  }

  function refreshButtons(){

    const answerButtonsElement = document.getElementById('answer-buttons');
    Array.from(answerButtonsElement.children).forEach(button => {
      button.classList.remove('incorrect');
      button.classList.remove('correct');

  });
  }

  function handleFinishButtonClick(){
    console.log("press");

    setQuiz(false);
    setEnd(true)
  }

  function handleHomeButtonClick(){
    console.log("press");
    setCurrentQuestion(0);
    setScore(0);
    refreshResults();
    setInitial(true);
    setEnd(false)
  }

  function handleResultsButtonClick(){
    console.log("press");

    setResults(true);
    setEnd(false)
  }

  function handleRestartButtonClick(){
    setCurrentQuestion(0);
    setScore(0);
    refreshResults();
    setEnd(false);
    setQuiz(true);
  }
  function handleReturnEndButtonClick(){
    console.log("press");

    setResults(false);
    setEnd(true)
  }

  function refreshResults(){
    setResponse([]);
  }

  

  return (
    <div className="App" >
      <h1 id="mobile">Mobile sized</h1>
     

      <div id="box" className="container">

      {initial ? (
   
     <div id="initial">  
      {quizTitle!=null ? (
      <div><div id="title-section" >

        
<h1 id="quiz-title" >{quizTitle}</h1>        
</div>
<div className="initial-button">

<Button active type="button" onClick={handleStartButtonClick} id="start-btn" 
className="btn btn-lg btn-primary"
>Start</Button>   
</div></div>) : (
          <div>
  <span>Loading</span>
          </div> 
  
    
  )} 
      
      </div>
        ) : (
          <div></div>
        )
      }

{quiz ? (
     <div id="mainPage" >
     <h1 id="title">{quizTitle}</h1>
     <hr />
     
    
     <div id="question-container" >
         <p id="question">{quizData[currentQuestion].questionText}</p>
        
         {/* <div id="answer-buttons" >
                 <Button variant="primary" size="lg" block className="question-btn neutral">Answer 1</Button>
                 <Button variant="primary" size="lg" block className="question-btn neutral">Answer 2</Button>                
             <Button variant="primary" size="lg" block className="question-btn neutral">Answer 3</Button>
             <Button variant="primary" size="lg" block className="question-btn neutral">Answer 4</Button>
         </div> */}
         <div id="answer-buttons" className="answer-section">
           {quizData[currentQuestion].answerOptions.map((answerOption) => 
           (<Button onClick={()=> handleAnswerButtonClick( answerOption.answerText, answerOption.isCorrect)}  variant="primary" size="lg" className="question-btn " >{answerOption.answerText}</Button>))} </div>
     </div>
     <hr />
     <div id="footer">
         <div id="hud">
        
            
             <div id="progressText" className="hud-prefix">
     
             </div>
             <div>Question {currentQuestion +1} of {quizData.length} </div>
 <div id="progressBar">
     <div id="progressBarFull"></div>
 
 </div>

     </div>
     
     <div id="control-buttons" className="controls hud-prefix">
         <Button active type="button"  onClick={handleCheckButtonClick} id="check-btn" className="check-btn btn neutral hide">Check</Button>
         <Button active type="button" hidden onClick={handleNextButtonClick} id="next-btn" className="next-btn btn neutral hide">Next</Button>  
         <Button active type="button" hidden onClick={handleFinishButtonClick} id="finish-btn" className="next-btn btn neutral hide">Finish</Button>  
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
            
                 <span >Your Score: You scored {score} out of {questions.length +1} </span>     
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
             <td><span id="total-question">{quizData.length}</span></td>
         </tr>
       </thead>

       <tbody>
          <tr>
             <td>Correct</td>
             <td><span id="total-correct">{score}</span></td>
         </tr>
         <tr>
             <td>Incorrect</td>
             <td><span id="total-incorrect">{quizData.length - score}</span></td>
         </tr>
         <tr>
             <td>Percentage</td>
             <td><span id="percentage">{Number(Number(score).toFixed(2)/Number(quizData.length).toFixed(2)).toFixed(2) * 100}%</span></td>
         </tr>
         <tr>
             <td>Total Score</td>
             <td><span id="total-score">{score} / {quizData.length}</span></td>
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
         {/* <tr>
           <td>What is 3/5 of 100?</td>
           <td>60</td>
           <td>60</td>
         </tr> */}

         {response.map((answer) => 
           (<tr className={answer.color} >
             <td >{answer.question}</td>
             <td>{answer.yourAnswer}</td>
             <td>{answer.correctAnswer}</td>
             
           </tr>))}
         
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

