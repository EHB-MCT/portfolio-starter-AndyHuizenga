const express = require('express');
const knex = require('knex');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const osc = require('osc');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const knexfile = require('./db/knexfile');
const { log } = require('console');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;


const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },


});

app.use(cors())
app.use(bodyParser.json());
app.use(express.json());



const { startOscServer, createUdpPort, isType1Message, extractOscData, logReceivedTouchCoordinates, emitOscDataUpdate } = require('./helpers/OSCdataFormater');

const oscReceivedData = [];
const allOscData = [];
const oscport = 6001;

const oscServer = startOscServer(app, oscport);
const udpPort = createUdpPort(oscport);

udpPort.on('message', (oscMsg) => {
  if (isType1Message(oscMsg)) {
    const newOscData = extractOscData(oscMsg);
    oscReceivedData.push(newOscData);
    allOscData.push(newOscData);
    logReceivedTouchCoordinates(oscMsg);
    emitOscDataUpdate(io, newOscData.position);
  }
});

udpPort.open();

// Rest of your main file...


app.get('/oscdata', (req, res) => {
  const formattedData = allOscData.map((entry) => ({
    position: entry.position,
  }));

  res.json(formattedData);
});

const closeServer = () => {
  server.close();
};

app.get('/', (request, response) => {
  response.send('hello world');
});

app.post('/cleardata', (req, res) => {
  oscReceivedData.length = 0;
  res.status(204).send();
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('initial-osc-data', oscReceivedData);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});




const db = knex(knexfile.development);

app.get("api/phones", (request, response) => {
  db.select()
    .from("phones")
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    });
});

app.get("/phones", (request, response) => {
  db.select()
    .from("phones")
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    });
});

// Get a phone by ID
app.get("/api/phones/:id", (request, response) => {
  const { id } = request.params;

  db("phones")
    .where({ id })
    .first()
    .then((phone) => {
      if (!phone) {
        response.status(404).json({ error: "Phone not found" });
      } else {
        response.json(phone);
      }
    })
    .catch((error) => {
      console.error("Error retrieving phone:", error);
      response.status(500).json({ error: "Error retrieving phone" });
    });
});


// Update a phone by ID
app.put("/api/phones/:id", (request, response) => {
  const { id } = request.params;
  const { name, brand_id } = request.body;

  db("phones")
    .where({ id })
    .update({ name, brand_id })
    .returning("*")
    .then((updatedPhone) => {
      if (updatedPhone.length === 0) {
        response.status(404).json({ error: "Phone not found" });
      } else {
        response.json(updatedPhone);
      }
    })
    .catch((error) => {
      console.error("Error updating phone:", error);
      response.status(500).json({ error: "Error updating phone" });
    });
});



// Post a new phone
app.post("/api/phones", (request, response) => {
  const { phone_model, brand_id } = request.body;

  db("phones")
    .insert({ phone_model, brand_id })
    .returning("*")
    .then((newPhone) => {
      response.json(newPhone);
    })
    .catch((error) => {
      console.error("Error creating phone:", error);
      response.status(500).json({ error: "Error creating phone" });
    });
});

// Add this route in your Express server
app.get("/phonesandbrands", (request, response) => {
  db.select('phones.id', 'phones.phone_model', 'phones.brand_id', 'phones.created_at', 'phones.updated_at', 'phones_brands.brand_name')
    .from("phones")
    .leftJoin('phones_brands', 'phones.brand_id', 'phones_brands.id')
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    });
});



// Delete a phone by ID
app.delete("/api/phones/:id", (request, response) => {
  const { id } = request.params;

  db("phones")
    .where({ id })
    .del()
    .then((numDeleted) => {
      if (numDeleted === 0) {
        response.status(404).json({ error: "Phone not found" });
      } else {
        response.json({ message: "Phone deleted successfully" });
      }
    })
    .catch((error) => {
      console.error("Error deleting phone:", error);
      response.status(500).json({ error: "Error deleting phone" });
    });
});

//get all brands
app.get("/brands", (request, response) => {
  db("phones_brands")
    .select("*")
    .then((brands) => {
      response.json(brands);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    });
});



// user routes //



//create new user
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db('users').insert({
      email,
      password: hashedPassword,
    });
    console.log("User registered successfully with " + email )
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("User registered unsuccessfully with " + email )
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// check user account and login 
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ email, userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token, user: { id: user.id, email: user.email } });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const SECRET_KEY = '03030303elir';

// Function to generate a JWT
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Adjust the expiration time as needed
};

// Function to verify a JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  console.log('Received Token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }
  
    console.log('Decoded Token Payload:', decoded);
  
    req.user = decoded;
    next();
  });
}

// If the token is valid, send the authenticated user data
app.get('/api/check-authentication', verifyToken, (req, res) => {

  res.json({ user: req.user });
});

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});


// Save drawing data in the database
app.post('/api/save-drawing-points', verifyToken, async (req, res) => {
  console.log("saving trigger");
  console.log("Request object:", req.body);

  try {
    const userId = req.user.userId;
    const { all } = req.body;


    const savedDrawing = await db('drawings')
      .insert({
        user_id: userId,
        all: JSON.stringify(all),
      })
      .returning('*');

    console.log('Drawing points saved successfully:', savedDrawing);
    res.json(savedDrawing);
  } catch (error) {
    console.error('Error saving drawing points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  // Fetch user drawings from the database
app.get('/api/drawings/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userEmail = req.user.email;
  
    const userDrawings = await db('drawings')
      .select('*')
      .where({ user_id: userId });

      const drawingsWithUserEmail = userDrawings.map((drawing) => ({
        id: drawing.id,
        user_id: drawing.user_id,
        all: drawing.all,
        created_at: drawing.created_at,
        email: userEmail,
      }));

    console.log('User drawings fetched successfully:', drawingsWithUserEmail);
    res.json(drawingsWithUserEmail);
  } catch (error) {
    console.error('Error fetching user drawings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if the drawing belongs to the authenticated user and delete it
app.delete('/api/drawings/:drawingId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const drawingId = req.params.drawingId;

  
    const drawingToDelete = await db('drawings')
      .select('*')
      .where({ id: drawingId, user_id: userId })
      .first();

    if (!drawingToDelete) {
      return res.status(404).json({ error: 'Drawing not found or unauthorized to delete' });
    }

  
    await db('drawings').where({ id: drawingId }).del();

    console.log('Drawing deleted successfully:', drawingToDelete);
    res.json({ message: 'Drawing deleted successfully' });
  } catch (error) {
    console.error('Error deleting drawing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
