/**
 * AUTHENTICATION MIDDLEWARE
 * Verifies incoming JSON Web Tokens (JWT) to protect order book routes.
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secure_jwt_production_secret_key_123';

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided or malformed header.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verifiedPayload = jwt.verify(token, JWT_SECRET);
    req.user = verifiedPayload; // Attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
};