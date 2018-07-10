const options = {
  timestamps: true
};

/**
 * Douban api v2 book model
 */
const fields = {
  id: { type: Number },
  alt: { type: String },
  alt_title: { type: String },
  author: [{ type: String }],
  author_intro: { type: String },
  binding: { type: String },
  catalog: { type: String },
  image: { type: String },
  images: {
    small: { type: String },
    large: { type: String },
    medium: { type: String },
  },
  isbn10: { type: String },
  isbn13: { type: String },
  origin_title: { type: String },
  pages: { type: String },
  price: { type: String },
  pubdate: { type: String },
  publisher: { type: String },
  rating: {
    max: { type: Number },
    numRaters: { type: Number },
    average: { type: Number },
    min: { type: Number },
  },
  subtitle: { type: String },
  summary: { type: String },
  title: { type: String },
  translator: [{ type: String }],
  tags: [{
    _id: false,
    count: { type: Number },
    name: { type: String },
    title: { type: String }
  }],
  url: { type: String },
};

module.exports = function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.index({ isbn10: 1, isbn13: 1 });
  return mongoose.model(name, schema);
};
module.exports.schema = fields;