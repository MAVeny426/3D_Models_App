import express from 'express';
import multer from 'multer';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { auth } from '../Middleware/authMiddleware.js';
import Model from '../Models/UploadFiles.js';
import nodemailer from 'nodemailer';

import dotenv from 'dotenv';

dotenv.config();

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

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.glb') || file.mimetype === 'model/gltf-binary') {
      cb(null, true);
    } else {
      cb(new Error('Only .glb files are allowed!'), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 }
});

async function deleteFileFromS3(key) {
  if (!key) return;
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  };
  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`Successfully deleted ${key} from S3`);
  } catch (err) {
    console.error(`Failed to delete ${key} from S3:`, err);
  }
}

router.post('/upload', auth, upload.single('glbFile'), async (req, res) => {
  console.log('--- Incoming Model Upload Request ---');
  console.log('Authenticated User (req.user):', req.user ? req.user.email : 'N/A');

  let uploadedS3Key = null;

  try {
    if (!req.user || !req.user.id) {
      console.error('Authentication failed: req.user or req.user.id is missing.');
      return res.status(401).json({ msg: 'Authentication required or invalid token.' });
    }
    if (!req.file) {
      console.error('Multer failed to upload file to memory: req.file is missing.');
      return res.status(400).json({ msg: 'No GLB file uploaded.' });
    }

    const { name, description, category, creatorName, creatorWebsite, creatorEmail, specs } = req.body;
    if (!name || !description || !category || !creatorName || !creatorEmail) {
      console.error('Required fields missing for model:', { name, description, category, creatorName, creatorEmail });
      return res.status(400).json({ msg: 'Please fill in all required fields (including creator email).' });
    }

    let parsedSpecs = {};
    if (specs) {
      try {
        parsedSpecs = JSON.parse(specs);
      } catch (e) {
        console.warn('Could not parse specs as JSON, storing as raw text:', specs);
        parsedSpecs = { raw: specs.toString() };
      }
    }

    const fileNameInS3 = `models/${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    uploadedS3Key = fileNameInS3;

    const uploadParams = {
      Bucket: S3_BUCKET_NAME,
      Key: fileNameInS3,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };

    const parallelUploads3 = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log(`S3 Upload Progress for ${fileNameInS3}: ${Math.round(progress.loaded / progress.total * 100)}%`);
    });

    const data = await parallelUploads3.done();
    const glbUrl = data.Location;

    console.log('S3 Upload successful, GLB URL:', glbUrl);

    const newModel = new Model({
      name,
      description,
      category,
      glbUrl: glbUrl,
      s3Key: fileNameInS3,
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

    if (uploadedS3Key) {
      console.log(`Attempting to clean up S3 file (${uploadedS3Key}) due to subsequent error.`);
      await deleteFileFromS3(uploadedS3Key);
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

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Authentication required or invalid token.' });
    }

    const model = await Model.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ msg: 'Model not found.' });
    }

    if (model.creator.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized to delete this model.' });
    }

    if (model.s3Key) {
      await deleteFileFromS3(model.s3Key);
    } else {
      console.warn(`Model ${model._id} has no s3Key, skipping S3 deletion.`);
    }

    await model.deleteOne();

    res.status(200).json({ msg: 'Model deleted successfully!' });
  } catch (err) {
    console.error('Error deleting model:', err);
    if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Invalid model ID format.' });
    }
    res.status(500).json({ msg: 'Server error during model deletion.', error: err.message });
  }
});

router.post('/api/contact', async (req, res) => {
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
    console.error('Error sending contact email:', error);
    res.status(500).json({ message: 'Failed to send message.', error: error.message });
  }
});

export default router;