const Entity = require('mostly-entity');

const DoubanEntity = new Entity('Douban');

DoubanEntity.discard('_id');

module.exports = DoubanEntity.freeze();
