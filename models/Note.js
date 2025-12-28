import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // updated here
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  taggedAgents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // updated here as well
  }],
}, { timestamps: true });

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
