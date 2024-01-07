// MyArt.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ENDPOINT = 'http://localhost:3001'; // Update with your server URL

function MyArt() {
  const [userDrawings, setUserDrawings] = useState([]);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [userEmail, setUserEmail] = useState('');
  const [currentColor, setCurrentColor] = useState('red');
  const allColors = ["red", "blue", "yellow", "orange"];
  


  useEffect(() => {
    // Fetch user-specific drawings when the component mounts
    const fetchUserDrawings = async () => {
      try {
        const token = localStorage.getItem('token').trim();

        // Fetch user only when the button is pressed
        const fetchUserResponse = await fetch(`${ENDPOINT}/api/check-authentication`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (fetchUserResponse.ok) {
          const authenticatedUser = await fetchUserResponse.json();

          if (authenticatedUser) {
            // Continue with fetching user-specific drawings
            const fetchDrawingsResponse = await fetch(`${ENDPOINT}/api/drawings/user`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            });

            if (fetchDrawingsResponse.ok) {
              const drawings = await fetchDrawingsResponse.json();
              setUserDrawings(drawings);
              drawSavedDrawingOnCanvas(drawings);
              setUserEmail(authenticatedUser.email);
            } else {
              const data = await fetchDrawingsResponse.json();
              console.error('Error fetching drawings:', data.error);
              alert('Error fetching drawings. Please try again.');
            }
          } else {
            // Handle the case where user authentication fails
            console.error('User authentication failed');
            alert('User authentication failed. Please log in again.');
            navigate('/login');
          }
        } else {
          // Handle the case where user authentication fails
          console.error('User authentication failed');
          alert('User authentication failed. Please log in again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Unexpected error during fetchUserDrawings:', error);
        alert('Unexpected error occurred. Please try again later.');
      }
    };

    fetchUserDrawings();
  }, [navigate]);

  useEffect(() => {
    console.log('Fetched user drawings:', userDrawings);
  }, [userDrawings]);
  

  const drawSavedDrawingOnCanvas = (drawing) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas before drawing the new artwork
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const xList = drawing.all?.xList || []; 
    const yList = drawing.all?.yList || [];
  
    xList.forEach((x, index) => {
      const y = yList[index];
      ctx.fillStyle = currentColor; 
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const handleShowButtonClick = (drawing) => {
    drawSavedDrawingOnCanvas(drawing);
  };

  const changeColor = (drawing) => {
    setCurrentColor((prevColor) => {
      // Toggle to the next color in the array
      const currentIndex = allColors.indexOf(prevColor);
      const nextIndex = (currentIndex + 1) % allColors.length;
  
      console.log('Current Color:', prevColor);
      console.log('Next Index:', nextIndex);
      console.log('Next Color:', allColors[nextIndex]);
  
      return allColors[nextIndex];
    });
  
    handleShowButtonClick(drawing)
  };
  


  

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">My Art</h1>
      <div className="row">
        <div className="col-md-6 mb-4 mt-4">
          {userDrawings.map((drawing) => (
            <div key={drawing.id} className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Drawing: {drawing.id}</h5>
                <p className="card-text">User: {drawing.email}</p>
                <p className="card-text">Created At: {drawing.created_at}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleShowButtonClick(drawing)}
                >
                  Show
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => changeColor(drawing)}
                >
                  change color
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-6 mb-4">
          <div className="painting-canvas-container">
            <canvas ref={canvasRef} width={4985} height={4985} className="live-canvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyArt;
