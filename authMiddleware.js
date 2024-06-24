const jwt = require('jsonwebtoken');
// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).send({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).send({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add the decoded user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
