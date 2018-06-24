import { plugins } from 'mostly-feathers-mongoose';

/**
 * Chapter of a parent book
 */
const fields = {
  content: { type: String, default: '' },
  mimetype: { type: String }
};

export default function (app, name) {
  const mongoose = app.get('mongoose');
  const DocumentModel = mongoose.model('document');
  const schema = new mongoose.Schema(fields);
  return DocumentModel.discriminator(name, schema);
}