import mongoose from 'mongoose';

const uploadFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  glbUrl: { type: String, required: true },
  s3Key: { type: String, required: false },
  uploadDate: { type: Date, default: Date.now },
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
  specs: { type: Object }
});

const UploadFile = mongoose.model('UploadFile', uploadFileSchema);
export default UploadFile;