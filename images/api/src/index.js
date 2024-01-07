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
let server; 
server = http.createServer(app);
const port = process.env.PORT || 3001;
const { startOscServer, createUdpPort, isType1Message, extractOscData, logReceivedTouchCoordinates, emitOscDataUpdate } = require('./helpers/OSCdataformater');
const { generateToken, verifyToken } = require('./helpers/UserCheck');
const db = knex(knexfile.development);
module.exports = { app, server }; 

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },


});

app.use(cors())
app.use(bodyParser.json());
app.use(express.json());


 /**
 * Initializes OSC server and UDP port for OSC communication.
 * Listens for OSC messages, processes them, and updates data accordingly.
 */


let oscReceivedData = [];
let allOscData = [];
function startOSC() {

 
  
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
}

app.post('/start-osc', (req, res) => {
  startOSC(); 
  res.send('OSC started.'); 
});


  /**
 * Express route to handle GET requests for OSC data.
 * Formats and sends the collected OSC data in a JSON response.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} res - Array with object containing all the points 
 */
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

  /**
 * Express route to handle POST requests for clearing OSC data.
 * Clears the stored OSC received data and sends a no-content (204) response.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} res - No-content (204) response.
 */
app.post('/cleardata', (req, res) => {
  oscReceivedData.length = 0;
  res.status(204).send();
});

io.on('connection', (socket) => {
  
  socket.emit('initial-osc-data', oscReceivedData);

  socket.on('disconnect', () => {
    
  });
});

server.listen(port, () => {
  
});



  /**
 * Express route to handle GET requests for fetching all phones.
 * Retrieves all phone records from the database and sends them in a JSON response.
 *
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 * @returns {object} response - JSON response with an array of phone records.
 */

app.get("api/phones", (request, response) => {
  db.select()
    .from("phones")
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      
      response.status(500).json({ error: "Internal server error" });
    });
});

/**
 * Express route to handle GET requests for fetching all phones.
 * Retrieves all phone records from the database and sends them in a JSON response.
 *
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 * @returns {object} response - JSON response with an array of phone records.
 */
app.get("/phones", (request, response) => {
  db.select()
    .from("phones")
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      
      response.status(500).json({ error: "Internal server error" });
    });
});

/**
 * Express route to handle GET requests for fetching a phone by ID.
 * Retrieves a phone record from the database based on the provided ID and sends it in a JSON response.
 *
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 * @returns {object} response - JSON response with the phone record or an error message if not found.
 */
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
      
      response.status(500).json({ error: "Error retrieving phone" });
    });
});

/**
 * Express route to handle PUT requests for updating a phone by ID.
 * Updates the specified phone record in the database and sends the updated record in a JSON response.
 *
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 * @returns {object} response - JSON response with the updated phone record or an error message if not found.
 */
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
      
      response.status(500).json({ error: "Error updating phone" });
    });
});



/**
 * Express route to handle POST requests for creating a new phone record.
 * Creates a new phone record in the database and sends the newly created record in a JSON response.
 *
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 * @returns {object} response - JSON response with the newly created phone record or an error message.
 */
app.post("/api/phones", (request, response) => {
  const { phone_model, brand_id } = request.body;

  db("phones")
    .insert({ phone_model, brand_id })
    .returning("*")
    .then((newPhone) => {
      response.json(newPhone);
    })
    .catch((error) => {
      
      response.status(500).json({ error: "Error creating phone" });
    });
});

/**
 * Express route to handle GET requests for retrieving phones and their corresponding brands.
 * Retrieves records from the "phones" table, including the associated brand name from the "phones_brands" table.
 * Sends the formatted data in a JSON response.
 *
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 * @returns {object} response - JSON response with the retrieved phone and brand data or an error message.
 */
app.get("/phonesandbrands", (request, response) => {
  db.select('phones.id', 'phones.phone_model', 'phones.brand_id', 'phones.created_at', 'phones.updated_at', 'phones_brands.brand_name')
    .from("phones")
    .leftJoin('phones_brands', 'phones.brand_id', 'phones_brands.id')
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      
      response.status(500).json({ error: "Internal server error" });
    });
});



/**
 * Express route to handle DELETE requests for deleting a phone by ID.
 * Deletes the phone record from the "phones" table based on the provided ID.
 *
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 * @returns {object} response - JSON response indicating the success or failure of the deletion process.
 */
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
      
      response.status(500).json({ error: "Error deleting phone" });
    });
});

/**
 * Express route to handle GET requests for retrieving all phone brands.
 * Retrieves and sends all records from the "phones_brands" table in a JSON response.
 *
 * @param {object} request - The HTTP request object.
 * @param {object} response - The HTTP response object.
 * @returns {object} response - JSON array containing all phone brands.
 */
app.get("/brands", (request, response) => {
  db("phones_brands")
    .select("*")
    .then((brands) => {
      response.json(brands);
    })
    .catch((error) => {
      
      response.status(500).json({ error: "Internal server error" });
    });
});


/**
 * Express route to handle POST requests for user registration.
 * Inserts a new user record with hashed password into the "users" table.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} res - JSON response indicating success or failure of user registration.
 */
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db('users').insert({
      email,
      password: hashedPassword,
    });
    
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    
    
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});


const SECRET_KEY = '03030303elir';

/**
 * Express route to handle POST requests for user login.
 * Retrieves the user with the provided email, checks the password, and issues a JWT token upon successful login.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} res - JSON response containing a JWT token and user information on successful login,
 *                       or an error message on unsuccessful login.
 */
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
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// If the token is valid, send the authenticated user data
app.get('/api/check-authentication', verifyToken, (req, res) => {

  res.json({ user: req.user });
});

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

/**
 * Express route to handle POST requests for saving drawing points.
 * Requires a valid JWT token for authentication.
 * Saves the drawing points associated with the authenticated user in the database.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} res - JSON response containing the saved drawing points or an error message.
 */
app.post('/api/save-drawing-points', verifyToken, async (req, res) => {
  
  

  try {
    const userId = req.user.userId;
    const { all } = req.body;


    const savedDrawing = await db('drawings')
      .insert({
        user_id: userId,
        all: JSON.stringify(all),
      })
      .returning('*');

    
    res.json(savedDrawing);
  } catch (error) {
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Express route to handle GET requests for fetching drawings associated with the authenticated user.
 * Requires a valid JWT token for authentication.
 * Retrieves drawings from the database based on the authenticated user's ID.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} res - JSON response containing the user's drawings or an error message.
 */
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

    
    res.json(drawingsWithUserEmail);
  } catch (error) {
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Express route to handle DELETE requests for deleting a drawing associated with the authenticated user.
 * Requires a valid JWT token for authentication.
 * Deletes a drawing from the database based on the provided drawing ID and the authenticated user's ID.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @returns {object} res - JSON response indicating the success or failure of the deletion.
 */
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

    
    res.json({ message: 'Drawing deleted successfully' });
  } catch (error) {
    
    res.status(500).json({ error: 'Internal server error' });
  }
});