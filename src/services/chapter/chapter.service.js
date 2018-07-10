const makeDebug = require('debug');
const { Service, helpers, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

const ChapterModel = require('../../models/chapter.model');
const defaultHooks = require('./chapter.hooks');

const debug = makeDebug('playing:book-services:chapters');

const defaultOptions = {
  name: 'chapters'
};

class ChapterService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  async find (params) {
    params = { query: {}, ...params };
    params.query.$sort = params.query.$sort || { position: 1 };

    return super.find(params);
  }
}

module.exports = function init (app, options, hooks) {
  options = { ModelName: 'chapter', ...options };
  return createService(app, ChapterService, ChapterModel, options);
};
module.exports.Service = ChapterService;
