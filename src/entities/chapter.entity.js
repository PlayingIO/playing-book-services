import Entity from 'mostly-entity';
import fp from 'mostly-func';
import { BlobEntity, DocTypes } from 'playing-content-common';

const ChapterEntity = new Entity('Chapter', {
  file: { using: BlobEntity },
  files: { using: BlobEntity },
});

ChapterEntity.expose('metadata', (obj, options) => {
  obj.metadata = obj.metadata || {};
  
  const Types = options.DocTypes || DocTypes;

  if (Types[obj.type]) {
    obj.metadata.facets = Types[obj.type].facets;
    obj.metadata.packages = Types[obj.type].packages;
  }
  
  return fp.sortKeys(obj.metadata);
});

ChapterEntity.excepts('destroyedAt');

export default ChapterEntity.asImmutable();
