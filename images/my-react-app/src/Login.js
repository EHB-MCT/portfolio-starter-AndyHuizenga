import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link } from 'react-router-dom';

const ENDPOINT = 'http://localhost:3001'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // Successful login, you can handle the data, such as storing the token in localStorage
        console.log('Login successful:', data);
      } else {
        const data = await response.json();
        console.error('Error during login:', data.error);
        // Handle the error, you can show an error message or update state accordingly
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle unexpected errors, show an error message or update state accordingly
    }
  };
  


  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h2>Login</h2>
          <form>
            <div className="mb-3 mt-5">
              <label htmlFor="email" className="form-label" style={{ float: 'left' }}>Email:</label>
              <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ float: 'left' }}>Password:</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
            <Link to="/createUser" className="btn btn-primary" style={{ marginLeft: '10px' }}>New User</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
