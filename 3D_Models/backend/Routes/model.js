// Routes/model.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import { auth } from '../Middleware/authMiddleware.js';
import Model from '../Models/UploadFiles.js';
import nodemailer from 'nodemailer'; // ADD THIS LINE

import dotenv from 'dotenv'; // Keep this if you use dotenv in this file for transporter

dotenv.config(); // Ensure dotenv is loaded here for transporter access

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    try {
      await fsPromises.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      console.error('Error creating upload directory:', err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.glb') || file.mimetype === 'model/gltf-binary') {
      cb(null, true);
    } else {
      cb(new Error('Only .glb files are allowed!'), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post('/upload', auth, upload.single('glbFile'), async (req, res) => {
  console.log('--- Incoming Model Upload Request ---');
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);
  console.log('Authenticated User (req.user):', req.user);

  try {
    if (!req.user || !req.user.id) {
      console.error('Authentication failed: req.user or req.user.id is missing.');
      if (req.file) {
        await fsPromises.unlink(req.file.path).catch(unlinkErr => console.error('Failed to delete unauthenticated upload:', unlinkErr));
      }
      return res.status(401).json({ msg: 'Authentication required or invalid token.' });
    }
    if (!req.file) {
      console.error('Multer failed to upload file: req.file is missing.');
      return res.status(400).json({ msg: 'No GLB file uploaded.' });
    }
    const { name, description, category, creatorName, creatorWebsite, creatorEmail, specs } = req.body;
    if (!name || !description || !category || !creatorName || !creatorEmail) {
      console.error('Required fields missing:', { name, description, category, creatorName, creatorEmail });
      if (req.file) {
        await fsPromises.unlink(req.file.path).catch(unlinkErr => console.error('Failed to delete file after field validation error:', unlinkErr));
      }
      return res.status(400).json({ msg: 'Please fill in all required fields (including creator email).' });
    }
    let parsedSpecs = {};
    if (specs) {
      try {
        parsedSpecs = JSON.parse(specs);
      } catch (e) {
        console.warn('Could not parse specs as JSON, storing as raw text:', specs);
        parsedSpecs = { raw: specs };
      }
    }
    const newModel = new Model({
      name,
      description,
      category,
      glbUrl: `/uploads/${req.file.filename}`,
      creator: {
        name: creatorName,
        email: creatorEmail,
        website: creatorWebsite,
        user: req.user.id
      },
      specs: parsedSpecs,
    });
    await newModel.save();
    res.status(201).json({
      msg: 'Model uploaded successfully!',
      model: newModel
    });

  } catch (err) {
    console.error('--- Model Upload Route Caught Error ---');
    console.error('Full Error Object:', err);

    if (req.file) {
      await fsPromises.unlink(req.file.path).catch(unlinkErr => console.error('Failed to delete uploaded file on error:', unlinkErr));
    }
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: `File upload error: ${err.message}` });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    res.status(500).json({ msg: 'Server error during model upload.', error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Authentication required or invalid token.' });
    }
    const models = await Model.find({ 'creator.user': req.user.id })
                               .populate('creator.user', 'name email')
                               .sort({ uploadDate: -1 });

    res.status(200).json(models);
  } catch (err) {
    console.error('Error fetching models:', err.message);
    res.status(500).json({ msg: 'Server error while fetching models.', error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Authentication required or invalid token.' });
    }

    const model = await Model.findById(req.params.id)
                             .populate('creator.user', 'name email');

    if (!model) {
      return res.status(404).json({ msg: '3D Model not found.' });
    }
    res.status(200).json(model);
  } catch (err) {
    console.error(`Error fetching model with ID ${req.params.id}:`, err.message);
    if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Invalid model ID format.' });
    }
    res.status(500).json({ msg: 'Server error while fetching model details.', error: err.message });
  }
});

router.get('/api/contact', auth, async (req, res) => {
  try {
    const { search } = req.query;
    const userEmail = req.user.email;

    let query = { 'creator.email': userEmail };

    if (search) {
      const searchRegex = new RegExp(search, 'i');

      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { 'creator.name': searchRegex },
      ];
    }

    const models = await Model.find(query);

    res.status(200).json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ msg: 'Server error while fetching models.', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <p>You have received a new message from your contact form.</p>
        <h3>Contact Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully! 🎉' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to send message.', error: error.message });
  }
});


export default router;