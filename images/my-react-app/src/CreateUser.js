// src/CreateUser.js
import React, { useState } from 'react';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateUser = () => {
    // Implement your create user logic here
    console.log('Create User button clicked');
  };

  return (
    <div>
      <h2>Create User</h2>
      <form>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="button" onClick={handleCreateUser}>Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;
