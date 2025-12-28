import mongoose, { Schema, models, model } from 'mongoose';

const FileSchema = new Schema({
  client:     { type: Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'Employee' },
  name:       { type: String, required: true, trim: true },
  fileType:   { type: String, enum: ['generic','id','agreement','income','other'], default: 'generic' },
  url:        { type: String, required: true },
  size:       Number,
  mimeType:   String,
}, { timestamps: true });

FileSchema.index({ client: 1, createdAt: -1 });

export const File = models.File || model('File', FileSchema);
