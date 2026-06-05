const jwt = require('jsonwebtoken');

const generateToken = (email) => {
  return jwt.sign(email, process.env.SECRETE_KEY, { expiresIn: '36d' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRETE_KEY);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
