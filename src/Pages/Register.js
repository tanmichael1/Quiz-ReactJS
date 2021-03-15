import React from 'react';

function Register(){
    return(
        <div className="container">
            <h1>Register</h1>
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
                <button type="submit" className="btn btn-primary" >Register</button>

            </form>
        </div>
    )
}

export default Register;