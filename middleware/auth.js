const { verifyToken } = require('../utils/jwt');

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ message: 'Token is not valid' });
  
  req.user = decoded;
  next();
};

module.exports = { verifyTokenMiddleware };
