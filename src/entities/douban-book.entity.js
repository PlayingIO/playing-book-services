import Entity from 'mostly-entity';

const DoubanEntity = new Entity('Douban');

DoubanEntity.discard('_id');

export default DoubanEntity.freeze();
