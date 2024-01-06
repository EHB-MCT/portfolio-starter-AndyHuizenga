const express = require('express');
const knex = require('knex');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const osc = require('osc');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');




const { CheckPhoneNames } = require('./helpers/helpers');
const knexfile = require('./db/knexfile');
const { log } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },


});

app.use(cors())
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

console.log('is .env working', process.env.POSTGRES_PASSWORD);

const oscReceivedData = [];
const allOscData = []; 
const oscport = 6001;

const oscServer = app.listen(oscport, () => {
  console.log('OSC Server is running ' + oscport);
});

const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: oscport,
  metadata: true,
});

udpPort.on('message', (oscMsg) => {
  if (isType1Message(oscMsg)) {
    const newOscData = {
      position: {
        x: parseFloat(oscMsg.args[0].value),
        y: parseFloat(oscMsg.args[1].value),
      },
    };
    oscReceivedData.push(newOscData);
    allOscData.push(newOscData);

    console.log('Received touch coordinations:', oscMsg);

    // Emit new data to all connected clients
    io.emit('osc-data-update', {
      position: newOscData.position,
    });
  }
});

udpPort.open();

function isType1Message(oscMsg) {
  return (
    oscMsg.address === '/touch/pos' &&
    oscMsg.args &&
    oscMsg.args.length === 2 &&
    oscMsg.args[0].type === 's' &&
    oscMsg.args[1].type === 's'
  );
}

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
    .first() // Retrieve the first matching record
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



// user 


const crypto = require('crypto');

// Generate a random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const SECRET_KEY = generateSecretKey();
console.log('Temporary secret key for development:', SECRET_KEY);


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
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

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

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});