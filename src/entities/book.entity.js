import Entity from 'mostly-entity';
import fp from 'mostly-func';
import { BlobEntity, DocTypes } from 'playing-content-common';

const BookEntity = new Entity('Book', {
  file: { using: BlobEntity },
  files: { using: BlobEntity },
});

BookEntity.expose('metadata', (obj, options) => {
  obj.metadata = obj.metadata || {};
  
  const Types = options.DocTypes || DocTypes;

  if (Types[obj.type]) {
    obj.metadata.facets = Types[obj.type].facets;
    obj.metadata.packages = Types[obj.type].packages;
  }

  return fp.sortKeys(obj.metadata);
});

BookEntity.excepts('destroyedAt');

export default BookEntity.asImmutable();
