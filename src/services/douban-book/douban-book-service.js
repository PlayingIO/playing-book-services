import { Service, createService } from 'mostly-feathers-mongoose';
import request from 'request-promise';
import url from 'url';
import DoubanBookModel from '~/models/douban-book-model';
import defaultHooks from './douban-book-hooks';

const DoubanBookApi = 'https://api.douban.com/v2/book/';

const defaultOptions = {
  id: 'id',
  name: 'douban-books'
};

// Douban v2 book api with cache service
class DoubanBookService extends Service {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  _cache (uri) {
    return request({ uri, json: true }).then(result => {
      if (result) {
        return super.create(result);
      }
      return result;
    }).catch(err => {
      if (err.statusCode == 404) {
        throw new Error('No such book');
      }
      throw err;
    });
  }

  get (id, params) {
    const uri = url.resolve(DoubanBookApi, `isbn/${id}`);
    return this.action('first').find({ query: {
      $or: [
        { isbn10: id },
        { isbn13: id }
      ]
    }}).then(cached => {
      if (cached) {
        return cached;
      } else {
        return this._cache(uri);
      }
    });
  }
}

export default function init (app, options, hooks) {
  options = Object.assign({ ModelName: 'douban-book' }, options);
  return createService(app, DoubanBookService, DoubanBookModel, options);
}

init.Service = DoubanBookService;

