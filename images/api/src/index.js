const express = require('express');
const knex = require('knex');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const osc = require('osc');

const { CheckPhoneNames } = require('./helpers/helpers');
const knexfile = require('./db/knexfile');
const { log } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
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