import express from 'express';
import User from '../Models/User.js'; 
import jwt from 'jsonwebtoken'; 
import { auth, authorizeRoles } from '../Middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists with this email.' });
    }

    const role = 'user'; 

    user = new User({ name, email, password, role });
    await user.save(); 

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' } 
    );

    res.status(201).json({
      msg: 'User Created Successfully',
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Registration Failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: 'Invalid Credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ msg: 'Invalid Credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Login error', error: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

router.get('/admin-dashboard-data', auth, authorizeRoles('admin'), (req, res) => {
  res.json({
    msg: `Welcome to the Admin Dashboard, ${req.user.name || req.user.id}! Your role is ${req.user.role}.`,
    adminData: true
  });
});

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


export default router;
