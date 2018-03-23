import Entity from 'mostly-entity';

const DoubanEntity = new Entity('Douban');

DoubanEntity.excepts('destroyedAt');

export default DoubanEntity.asImmutable();
