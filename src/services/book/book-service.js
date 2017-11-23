import { Service, createService } from 'mostly-feathers-mongoose';
import BookModel from '~/models/book-model';
import defaultHooks from './book-hooks';

const defaultOptions = {
  name: 'books'
};

class BookService extends Service {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

}

export default function init (app, options, hooks) {
  options = Object.assign({ ModelName: 'book' }, options);
  return createService(app, BookService, BookModel, options);
}

init.Service = BookService;
