import assert from 'assert';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import BookModel from '../../models/book.model';
import defaultHooks from './book.hooks';

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

export class BookService extends Service {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  create (data, params) {
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

export default function init (app, options, hooks) {
  options = Object.assign({ ModelName: 'book' }, options);
  return createService(app, BookService, BookModel, options);
}

init.Service = BookService;
