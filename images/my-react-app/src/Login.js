import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your login logic here
    console.log('Login button clicked');
  };

  const handleNewUser = () => {
    // Implement your login logic here
    console.log('Login button clicked');
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
            <button type="button" className="btn btn-primary"style={{ marginLeft: '10px' }}  onClick={handleNewUser}>New User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
