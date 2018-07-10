const { hooks } = require('mostly-feathers-mongoose');
const DoubanBookEntity = require('../../entities/douban-book.entity');

module.exports = function (options = {}) {
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
};