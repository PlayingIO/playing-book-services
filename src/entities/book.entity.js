import Entity from 'mostly-entity';
import fp from 'mostly-func';
import { entities as contents } from 'playing-content-services';
import { DocTypes } from '~/constants';

const BookEntity = new Entity('Book', {
  file: { using: contents.BlobEntity },
  files: { using: contents.BlobEntity },
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
