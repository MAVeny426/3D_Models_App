import mongoose from 'mongoose';

const ModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true 
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true 
  },
  glbUrl: { 
    type: String,
    required: true
  },
  creator: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: { 
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please fill a valid email address'] 
    },
    website: { 
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please fill a valid website URL'] 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    }
  },
  specs: {
    type: mongoose.Schema.Types.Mixed,
    default: {} 
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

const Model = mongoose.model('Model', ModelSchema);

export default Model;
