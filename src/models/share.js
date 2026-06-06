import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema({
  // short unique ID like "abc123" — used in the URL
  shareId: {
    type: String,
    required: true,
    unique: true,
  },

 
  category: {
    type: String,
    required: true,
  },

 
  algo: {
    type: String,
    required: true,
  },

  
  inputData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },


  speed: {
    type: Number,
    default: 400,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // auto-delete after 30 days
    expires: 60 * 60 * 24 * 30,
  },
});

const Share = mongoose.model('Share', shareSchema);

export default Share;