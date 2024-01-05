// host-server.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello from the host machine!'));

app.listen(port, () => console.log(`Host server listening on port ${port}`));
