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
  


  return (
    <div className="App">
      
      <div class="container" id="initial">  
      <div id="title-section" >
            <h1 id="quiz-title" >The Ultimate Quiz</h1>        
        </div>

      </div>
      <div class="initial-button">
  
            <button id="start-btn" class="start-btn btn neutral">Start</button>   
        </div> 
      
    </div>
    
  );
}


