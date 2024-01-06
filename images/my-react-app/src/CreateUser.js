import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const ENDPOINT = 'http://localhost:3001'; 

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateUser = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        alert('User registered successfully');
        console.log('User registered successfully');
      } else {
        if (response.headers.get('Content-Type').includes('application/json')) {
          // Handle JSON response
          const data = await response.json();
          console.error('Error creating user:', data.error);
        } else {
          // Handle non-JSON response
          const text = await response.text();
          console.error('Error creating user. Non-JSON response:', text);
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h2>Create User</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="button" className="btn btn-primary" onClick={handleCreateUser}>
              Create User
            </button>

            <Link to="/login" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
              Back to Login
            </Link>
          </form>
        </div>
      </div>


    </div>
  );
};

export default CreateUser;
