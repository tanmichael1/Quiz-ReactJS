import React from 'react';

function Home(){
    let latestQuiz = "Test Quiz"
    return(
        <div className="container">
            <h1>Welcome to the Website</h1>
            {(latestQuiz)}
        </div>
    )
}

export default Home;