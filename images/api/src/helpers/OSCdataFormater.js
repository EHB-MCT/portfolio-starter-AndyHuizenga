
const osc = require('osc');

/**
 * Starts the OSC server and listens on the specified port.
 *
 * @param {object} app - The Express application instance.
 * @param {number} port - The port number for OSC communication.
 * @returns {object} The server instance.
 */

function startOscServer(app, port) {
  const server = app.listen(port, () => {
    
  });

  return server;
}

/**
 * Creates and configures a UDP port for OSC communication.
 *
 * @param {number} port - The port number for OSC communication.
 * @returns {object} The configured UDP port instance.
 */

function createUdpPort(port) {
  return new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: port,
    metadata: true,
  });
}

/**
 * Checks if the OSC message is a type-1 message.
 *
 * @param {object} oscMsg - The received OSC message.
 * @returns {boolean} True if the message is a type-1 message, false otherwise.
 */

function isType1Message(oscMsg) {
  return (
    oscMsg.address === '/touch/pos' &&
    oscMsg.args &&
    oscMsg.args.length === 2 &&
    oscMsg.args.every(arg => arg.type === 's')
  );
}
/**
 * Extracts relevant OSC data from the OSC message.
 *
 * @param {object} oscMsg - The received OSC message.
 * @returns {object} Extracted OSC data, including position information.
 */

function extractOscData(oscMsg) {
  return {
    position: {
      x: parseFloat(oscMsg.args[0].value),
      y: parseFloat(oscMsg.args[1].value),
    },
  };
}

function logReceivedTouchCoordinates(oscMsg) {
  
}

function emitOscDataUpdate(io, position) {
  io.emit('osc-data-update', { position });
}
function closeServer() {
  if (server) {
    server.close(() => {
    });
  }
}

module.exports = {
  startOscServer,
  createUdpPort,
  isType1Message,
  extractOscData,
  logReceivedTouchCoordinates,
  emitOscDataUpdate,
  closeServer
};

