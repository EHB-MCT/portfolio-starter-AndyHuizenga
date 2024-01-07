import React, { useState, useEffect, useRef } from 'react';
import './PaintingCanvas.css';
import { handleClearData } from './Buttons';
import 'bootstrap/dist/css/bootstrap.min.css';
import socketIOClient from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';



const ENDPOINT = 'http://localhost:3001'; // Update with your server URL


function OSCDataDisplay() {
  const [oscData, setOSCData] = useState([]);
  const canvasRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const trimmedToken = token ? token.trim() : null;
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  console.log('Token:', encodeURIComponent(trimmedToken));
  
  console.log('Token:', encodeURIComponent(token));
  const all = {
    xList: [],
    yList: [],
  };


  
  useEffect(() => {
    // Fetch user data only if token is present
    if (token) {
      
      const fetchUserData = async () => {
        try {
        
          const fetchUserResponse = await fetch(`${ENDPOINT}/api/check-authentication`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          });
  
          if (fetchUserResponse.ok) {
            
            const authenticatedUser = await fetchUserResponse.json();
            setIsLoggedIn(authenticatedUser ? true : false);
            if (authenticatedUser.user && authenticatedUser.user.email) {
              setCurrentUserEmail(authenticatedUser.user.email);
            }
          } else {
            // Handle the case where user authentication fails
            console.error('User authentication failed');
            alert('User authentication failed. Please log in again.');
            navigate('/login');
          }
        } catch (error) {
          console.error('Unexpected error during fetchUserData:', error);
          alert('Unexpected error occurred. Please try again later.');
        }
      };
  
      fetchUserData();
    }
  }, [token, navigate]);
  
  
    const saveDrawing = async () => {
      try {
        if (!token) {
          // Token is not present, handle it gracefully (redirect or show a message)
          navigate('/login');
          alert('You need to login to be able to save your art!');  // Redirect to login page or handle it as needed
          return;
        }
  
        // Continue with saving the drawing
        const saveDrawingResponse = await fetch(`${ENDPOINT}/api/save-drawing-points`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ all, token }), // Include the 'all' object and the token
        });
  
        if (saveDrawingResponse.ok) {
          alert('Drawing saved successfully!');
        } else {
          const data = await saveDrawingResponse.json();
          console.error('Error saving drawing:', data.error);
          alert('Error saving drawing. Please try again.');
        }
      } catch (error) {
        console.error('Unexpected error during saveDrawing:', error);
        alert('Unexpected error occurred. Please try again later.');
      }
    };
  
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    // Listen for initial data when connected
    socket.on('initial-osc-data', (initialData) => {
      setOSCData(initialData);
    });

    // Listen for real-time updates
    socket.on('osc-data-update', (oscUpdate) => {
      setOSCData((prevData) => [...prevData, oscUpdate]);
    });

    // Listen for data clearing
    socket.on('osc-data-cleared', () => {
      setOSCData([]);
    });

    // Clean up socket when component unmounts
    return () => socket.disconnect();
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

   

   
    oscData.forEach((data) => {
      if (data.position && data.position.x !== undefined && data.position.y !== undefined) {
        
        const x = mapOSCValueToCanvas(data.position.x * -1, canvas.width);
        const y = mapOSCValueToCanvas(data.position.y, canvas.height);
        // Draw a point on the canvas
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
       
        all.xList.push(x);
        all.yList.push(y);

      }
    });
  }, [oscData]);

  console.log("All coordinates:", all);

  // Use the 'all' object as needed (for example, store it in a state variable)
  console.log("All x values:", all.xList);
  console.log("All y values:", all.yList);
  

  const mapOSCValueToCanvas = (oscValue, canvasSize) => {
    // Map the OSC value between -5 and 5 to the canvas size
    const mappedValue = ((oscValue + 5) / 10) * canvasSize;

    // Reverse the Y values on the canvas
    return canvasSize - mappedValue;
  };

  
  const goToMyArt = () => {
    if (!isLoggedIn) {

      alert('You need to login to see your saved art!');
    } else {
    
      navigate('/my-art');
    }
  };

  const startOSC = async () => {
    try {
      const response = await fetch('http://localhost:3001/start-osc', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.text();
        alert(data); // Use alert instead of setMessage
      } else {
        alert('Failed to start OSC.'); // Use alert instead of setMessage
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred.'); // Use alert instead of setMessage
    }
  };


  return (
    <div>
      <UserCard userEmail={currentUserEmail} />
      <h1>Live OSC Data Painting</h1>
      <p>If your osc app is well connected you will be able to draw with your phone!</p>
      <div className="painting-container">
        <div className="painting-canvas-container">
          <canvas ref={canvasRef} width={4985} height={4985} className="live-canvas"></canvas>
        </div>
        <div className="buttons-container">
        <div>
        <button onClick={startOSC} className="btn btn-primary btn-success">Start OSC</button>
    </div>
        <button onClick={() => { saveDrawing(); }} className="btn btn-primary">
            Save Drawing
          </button>
          <button onClick={() => { handleClearData(); alert('OSC Data cleared!'); }} className="btn btn-danger">
            Clear OSC Data
          </button>
          <button onClick={goToMyArt} className="btn btn-success">
            Go to My Art
          </button>
        </div>
      </div>
    </div>
  );
}


export default OSCDataDisplay;
