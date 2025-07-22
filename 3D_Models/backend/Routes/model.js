import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch'; 

import { auth } from '../Middleware/authMiddleware.js';
import Model from '../Models/UploadFiles.js';

import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

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

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;
const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_UNPIN_URL = 'https://api.pinata.cloud/pinning/unpin/';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

async function deleteFileFromPinata(ipfsCid) {
  if (!ipfsCid) return;
  try {
    const response = await fetch(`${PINATA_UNPIN_URL}${ipfsCid}`, {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to unpin ${ipfsCid} from Pinata:`, errorData);
      throw new Error(`Pinata unpin failed: ${errorData.error || response.statusText}`);
    }
    console.log(`Successfully unpinned ${ipfsCid} from Pinata`);
  } catch (err) {
    console.error(`Error during Pinata unpin operation for ${ipfsCid}:`, err);
  }
}

router.post('/upload', auth, upload.single('glbFile'), async (req, res) => {
  console.log('--- Incoming Model Upload Request ---');
  console.log('Authenticated User (req.user):', req.user ? req.user.email : 'N/A');

  let uploadedIpfsCid = null;

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

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const options = JSON.stringify({
      cidVersion: 0,
      wrapWithDirectory: false
    });
    formData.append('pinataOptions', options);

    const metadata = JSON.stringify({
      name: req.file.originalname,
      keyvalues: {
        creator: creatorName,
        category: category,
        userId: req.user.id
      }
    });
    formData.append('pinataMetadata', metadata);


    console.log(`Attempting to upload ${req.file.originalname} to Pinata...`);
    const pinataResponse = await fetch(PINATA_API_URL, {
      method: 'POST',
      headers: {
        ...formData.getHeaders(), // CRUCIAL: Use form-data's headers
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY,
      },
      body: formData
    });

    if (!pinataResponse.ok) {
      const errorData = await pinataResponse.json();
      console.error('Pinata upload failed:', errorData);
      throw new Error(`Pinata upload failed: ${errorData.error || pinataResponse.statusText}`);
    }

    const pinataData = await pinataResponse.json();
    uploadedIpfsCid = pinataData.IpfsHash;
    const glbUrl = `${PINATA_GATEWAY}${pinataData.IpfsHash}`;

    console.log('Pinata Upload successful, GLB URL:', glbUrl);

    const newModel = new Model({
      name,
      description,
      category,
      glbUrl: glbUrl,
      ipfsCid: uploadedIpfsCid,
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

    if (uploadedIpfsCid) {
      console.log(`Attempting to unpin ${uploadedIpfsCid} due to subsequent error.`);
      await deleteFileFromPinata(uploadedIpfsCid);
    }

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: `File upload error: ${err.message}` });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: `Validation failed: ${messages.join(', ')}` });
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

    if (model.ipfsCid) {
      await deleteFileFromPinata(model.ipfsCid);
    } else {
      console.warn(`Model ${model._id} has no ipfsCid, skipping Pinata unpin.`);
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

export default router;