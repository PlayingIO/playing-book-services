import { Service, helpers, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import ChapterModel from '../../models/chapter.model';
import defaultHooks from './chapter.hooks';

const defaultOptions = {
  name: 'chapters'
};

export class ChapterService extends Service {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  find (params) {
    params = fp.assign({ query: {} }, params);
    params.query.$sort = params.query.$sort || { position: 1 };

    return super.find(params);
  }

  reorder (id, data, params, original) {
    return this.get(data.target).then((target) => {
      if (!target) throw new Error("data.target not exists");
      target = target.data || target;
      return helpers.reorderPosition(this.Model, original, target.position, { classify: 'parent' });
    });
  }
}

export default function init (app, options, hooks) {
  options = Object.assign({ ModelName: 'chapter' }, options);
  return createService(app, ChapterService, ChapterModel, options);
}

init.Service = ChapterService;
