import React from 'react';

const UserCard = ({ userEmail, onLogout }) => {
  return (
    <div className="user-card" style={{ position: 'absolute', top: 50, right: 0, zIndex: 1 }}>
      <div className="card" style={{ border: '2px solid green', borderRadius: '0', backgroundColor: 'green', color: 'white', borderRadius: '20px 0 0 20px' }}>
        <div className="card-body">
          <p className="card-text" style={{ fontSize: '12px' }}>User: {userEmail}</p>
        </div>
      </div>
      <button
            className="btn btn-danger"
            onClick={onLogout}
          >
            Logout
          </button>
    </div>
    
  );
};

export default UserCard;
