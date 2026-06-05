const cors = require('cors');

const corsOptions = {
  origin: true,
  credentials: true,
};

const corsMiddleware = cors(corsOptions);
const corsOptionsDelegate = cors(corsOptions);

module.exports = { corsMiddleware, corsOptionsDelegate };
