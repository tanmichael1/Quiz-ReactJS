import React from 'react';

function Login(){
    return(
        <div className="container">
            <h1>Login</h1>
            <form>
                <div>
                    <label>Username</label>
                    <input type="text" className="form-control" id="username" placeholder="Enter username" />

                </div>

                <div>
                    <label>Email address</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" />
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-primary" >Login</button>

            </form>
        </div>
    )
}

export default Login;