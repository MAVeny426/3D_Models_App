import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './Routes/auth.js';
import modelRouter from './Routes/model.js';
import contactRouter from './Routes/contact.js'; // ADDED: Import your new contact router

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/models', modelRouter);
app.use('/api/contact', contactRouter); // ADDED: Mount your contact router here

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT} ✨`);
});