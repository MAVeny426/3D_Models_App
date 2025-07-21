import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: "No token provided or invalid format. Expected 'Bearer <token>'" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token", error: err.message });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Your role (${req.user ? req.user.role : 'guest'}) is not authorized for this action.`
      });
    }
    next();
  };
};

export { auth, authorizeRoles };