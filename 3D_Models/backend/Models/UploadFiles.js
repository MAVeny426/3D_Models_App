import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  glbUrl: { type: String, required: true },
  ipfsCid: { type: String, required: true }, 
  creator: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  specs: { type: Object }, 
  uploadDate: { type: Date, default: Date.now },
});

const Model = mongoose.model('Model', modelSchema);

export default Model;