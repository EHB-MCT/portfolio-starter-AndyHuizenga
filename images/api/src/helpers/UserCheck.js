const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = '03030303elir';

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

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

module.exports = {
  generateToken,
  verifyToken,
};