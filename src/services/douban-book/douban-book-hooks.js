import { hooks } from 'mostly-feathers-mongoose';
import DoubanBookEntity from '~/entities/douban-book-entity';

module.exports = function (options = {}) {
  return {
    before: {
      all: [
      ]
    },
    after: {
      all: [
        hooks.presentEntity(DoubanBookEntity, options),
        hooks.responder()
      ]
    }
  };
};