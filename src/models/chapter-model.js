import timestamps from 'mongoose-timestamp';
import { plugins } from 'mostly-feathers-mongoose';

// chapter of a parent book
const fields = {
  content: { type: 'String', default: '' },
  mimetype: { type: 'String' }
};

export default function(app, name) {
  const mongoose = app.get('mongoose');
  const DocumentModel = mongoose.model('document');
  const schema = new mongoose.Schema(fields);
  schema.plugin(plugins.sortable, { classify: 'parent' });
  return DocumentModel.discriminator(name, schema);
}