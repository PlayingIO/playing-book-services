import { hooks } from 'mostly-feathers-mongoose';
import DoubanBookEntity from '~/entities/douban-book.entity';

export default function (options = {}) {
  return {
    before: {
      all: [
      ]
    },
    after: {
      all: [
        hooks.presentEntity(DoubanBookEntity, options.entities),
        hooks.responder()
      ]
    }
  };
}