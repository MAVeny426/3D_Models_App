import mongoose from 'mongoose';

// Define the schema for your 3D models
const ModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Removes whitespace from both ends of a string
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
    lowercase: true // Store categories in lowercase for consistent searching
  },
  glbUrl: { // This will store the path to the uploaded .glb file
    type: String,
    required: true
  },
  creator: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: { // NEW: Field to store the creator's email directly
      type: String,
      required: true, // Making it required as per your request to save it
      trim: true,
      lowercase: true,
      match: [/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please fill a valid email address'] // Basic email validation
    },
    website: { // Optional field for creator's website
      type: String,
      trim: true,
      match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please fill a valid website URL'] // Basic URL validation
    },
    // Link to the User who uploaded this model (assuming you have a User model)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to the 'User' model
      required: true
    }
  },
  specs: {
    // Allows flexible data types (e.g., objects, strings)
    // It will store the JSON stringified object from the frontend's individual spec fields
    type: mongoose.Schema.Types.Mixed,
    default: {} // Default to an empty object if no specs are provided
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  // You can add more fields here, e.g.,
  // views: { type: Number, default: 0 },
  // likes: { type: Number, default: 0 },
  // tags: [{ type: String, trim: true, lowercase: true }]
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Create and export the Mongoose Model
// 'Model' will correspond to a 'models' collection in your MongoDB database
const Model = mongoose.model('Model', ModelSchema);

export default Model;
