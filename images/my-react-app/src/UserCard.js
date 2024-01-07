import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ userEmail }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="user-card" style={{ position: 'absolute', top: 50, right: 0, zIndex: 1 }}>
      <div className="card" style={{ borderRadius: '0', backgroundColor: '#6397eb', color: 'white', borderRadius: '20px 0 0 20px' }}>
        <div className="card-body">
          {userEmail ? (
            <div>
              <img
                src="https://static-00.iconduck.com/assets.00/user-avatar-1-icon-511x512-ynet6qk9.png"  
                alt="User Image"
                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
              />
              <p className="card-text" style={{ fontSize: '12px', display: 'inline-block' }}> {userEmail}</p>
            </div>
          ) : (
            <p className="card-text" style={{ fontSize: '12px' }}>NO USER</p>
          )}
        </div>
      </div>
      {userEmail && (
        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default UserCard;
