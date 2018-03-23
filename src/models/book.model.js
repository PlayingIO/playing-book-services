import { plugins } from 'mostly-feathers-mongoose';

const fields = {
  authorIntro: { type: String },          // author introduction
  binding: { type: String },              // binding of book
  catalog: { type: String },              // catalog
  doubanRating: { type: Number },
  images: {
    small: { type: String },
    large: { type: String },
    medium: { type: String },
  },
  publisher: { type: String },            // publisher
  isbn: { type: String },                 // isbn13
  originTitle: { type: String },          // origin title
  pages: { type: Number },
  price: { type: String },
  rating: {
    max: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    average: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  subTitle: { type: String },             // sub title
  translators: [{ type: String }],        // trans
};

export default function (app, name) {
  const mongoose = app.get('mongoose');
  const DocumentModel = mongoose.model('document');
  const schema = new mongoose.Schema(fields);
  return DocumentModel.discriminator(name, schema);
}