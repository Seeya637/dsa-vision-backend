import jwt from 'jsonwebtoken';
import User from'../models/user.js';


export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token — unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user   = user;
    req.userId = decoded.userId;
    next();
  }
  catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};