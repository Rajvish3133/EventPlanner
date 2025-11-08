const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const authMiddleware = (req, res, next) => {
  try {
    // Check for token in cookies first, then in Authorization header
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      // Extract token from "Bearer <token>" format
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    console.log('Token:', token);

    if (!token) return res.status(401).json({ msg: 'No token, access denied' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);
    req.user = decoded; // attach user info to request

    next(); // move to next middleware/controller
  } catch (error) {
    console.error('JWT Verify Error:', error);
    res.status(401).json({ msg: 'Invalid or expired token' });
  }
};


module.exports=authMiddleware;