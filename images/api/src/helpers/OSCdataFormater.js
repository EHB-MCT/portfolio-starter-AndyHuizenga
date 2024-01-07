
const osc = require('osc');

function startOscServer(app, port) {
  const server = app.listen(port, () => {
    console.log(`OSC Server is running on port ${port}`);
  });

  return server;
}

function createUdpPort(port) {
  return new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: port,
    metadata: true,
  });
}

function isType1Message(oscMsg) {
  return (
    oscMsg.address === '/touch/pos' &&
    oscMsg.args &&
    oscMsg.args.length === 2 &&
    oscMsg.args.every(arg => arg.type === 's')
  );
}

function extractOscData(oscMsg) {
  return {
    position: {
      x: parseFloat(oscMsg.args[0].value),
      y: parseFloat(oscMsg.args[1].value),
    },
  };
}

function logReceivedTouchCoordinates(oscMsg) {
  console.log('Received touch coordinates:', oscMsg);
}

function emitOscDataUpdate(io, position) {
  io.emit('osc-data-update', { position });
}

module.exports = {
  startOscServer,
  createUdpPort,
  isType1Message,
  extractOscData,
  logReceivedTouchCoordinates,
  emitOscDataUpdate,
};

