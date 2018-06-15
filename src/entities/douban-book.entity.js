import Entity from 'mostly-entity';

const DoubanEntity = new Entity('Douban');

DoubanEntity.excepts('_id');

export default DoubanEntity.asImmutable();
