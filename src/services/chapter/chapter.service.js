import makeDebug from 'debug';
import { Service, helpers, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import ChapterModel from '../../models/chapter.model';
import defaultHooks from './chapter.hooks';

const debug = makeDebug('playing:book-services:chapters');

const defaultOptions = {
  name: 'chapters'
};

export class ChapterService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  find (params) {
    params = { query: {}, ...params };
    params.query.$sort = params.query.$sort || { position: 1 };

    return super.find(params);
  }
}

export default function init (app, options, hooks) {
  options = { ModelName: 'chapter', ...options };
  return createService(app, ChapterService, ChapterModel, options);
}

init.Service = ChapterService;
