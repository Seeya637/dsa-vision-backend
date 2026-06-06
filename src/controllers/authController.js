import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // .js extension zaroori hai

function generateToken(userId) {
  // Safe validation for JWT_SECRET
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_123';
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: '7d' }
  );
}

const authController = {

  // ── REGISTER ──────────────────────────────────────────────
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: 'Name, email and password are required'
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters'
        });
      }

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({
          message: 'Email already registered'
        });
      }

      const user  = await User.create({ name, email, password });
      const token = generateToken(user._id);

      return res.status(201).json({
        token,
        user: {
          id:    user._id,
          name:  user.name,
          email: user.email
        }
      });
    }
    catch (err) {
      console.error('Registered Error:', err);
      
      // Mongoose Validation Error catch karne ka sabse safe tariqa
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // ── LOGIN ─────────────────────────────────────────────────
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({
          message: 'Invalid email or password'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id);

      return res.json({
        token,
        user: {
          id:    user._id,
          name:  user.name,
          email: user.email
        }
      });
    }
    catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // ── GET ME (protected) ────────────────────────────────────
  async getMe(req, res) {
    try {
      return res.json({
        user: {
          id:        req.user._id,
          name:      req.user.name,
          email:     req.user.email,
          createdAt: req.user.createdAt
        }
      });
    }
    catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // ── LOGOUT ───────────────────────────────────────────────
  async logout(req, res) {
    return res.json({ message: 'Logged out successfully' });
  }
};

export default authController;
