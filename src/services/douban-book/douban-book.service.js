const makeDebug = require('debug');
const { Service, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');
const request = require('request-promise');
const url = require('url');

const DoubanBookModel = require('../../models/douban-book.model');
const defaultHooks = require('./douban-book.hooks');

const debug = makeDebug('playing:book-services:douban-books');

const DoubanBookApi = 'https://api.douban.com/v2/book/';

const defaultOptions = {
  id: 'id',
  name: 'douban-books'
};

// Douban v2 book api with cache service
class DoubanBookService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  async _cache (uri) {
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

  async get (id, params) {
    const uri = url.resolve(DoubanBookApi, `isbn/${id}`);
    return this.get(null, { query: {
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

module.exports = function init (app, options, hooks) {
  options = { ModelName: 'douban-book', ...options };
  return createService(app, DoubanBookService, DoubanBookModel, options);
};
module.exports.Service = DoubanBookService;

