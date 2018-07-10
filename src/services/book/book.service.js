const assert = require('assert');
const makeDebug = require('debug');
const { Service, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

const BookModel = require('../../models/book.model');
const defaultHooks = require('./book.hooks');

const debug = makeDebug('playing:book-services:books');

const defaultOptions = {
  name: 'books'
};

const doubanMapping = {
  'alt_title': 'altTitle',
  'author': 'authors',
  'author_intro': 'authorIntro',
  'binding': 'binding',
  'catalog': 'catalog',
  'images': 'images',
  'isbn13': 'isbn',
  'pubdata': 'issuedAt',
  'publisher': 'publisher',
  'pages': 'pages',
  'price': 'price',
  'summary': 'description',
  'title': 'title',
  'translator': 'translators',
};

class BookService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  async create (data, params) {
    assert(data.title, 'title is not provided');
    assert(data.isbn, 'isbn is not provided');

    const svcDouban = this.app.service('douban-books');

    if (data.useDouban) {
      return svcDouban.get(data.isbn).then(doubanBook => {
        const book = fp.pipe(
          fp.pick(Object.keys(doubanMapping)),
          fp.renameKeys(doubanMapping),
          fp.merge(data)
        )(doubanBook);
        if (doubanBook.rating) {
          book.doubanRating = doubanBook.rating.average;
        }
        return super.create(book, params);
      });
    } else {
      return super.create(data, params);
    }
  }

}

module.exports = function init (app, options, hooks) {
  options = { ModelName: 'book', ...options };
  return createService(app, BookService, BookModel, options);
};
module.exports.Service = BookService;
