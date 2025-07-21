import express from 'express';
import Contact from '../Models/Contact.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    const newContact = new Contact({
      name,
      email,
      phone: phone || null,
      message
    });

    await newContact.save();

    res.status(200).json({ message: 'Message saved successfully! 🎉' });

  } catch (error) {
    console.error('Error saving contact message:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to save message.', error: error.message });
  }
});

export default router;