import timestamps from 'mongoose-timestamp';
import { plugins } from 'mostly-feathers-mongoose';

const fields = {
  authors: [{ type: 'String' }],
  translators: [{ type: 'String' }],
  publisher: { type: 'String' },
  isbn: { type: 'String' },
  douban: { type: 'String' },
  rating: {
    max: { type: 'Number', default: 0 },
    min: { type: 'Number', default: 0 },
    average: { type: 'Number', default: 0 },
    total: { type: 'Number', default: 0 }
  },
  price: { type: 'Number', default: 0 }
};

export default function(app, name) {
  const mongoose = app.get('mongoose');
  const DocumentModel = mongoose.model('document');
  const schema = new mongoose.Schema(fields);
  return DocumentModel.discriminator(name, schema);
}