import { omit } from 'lodash';
import Entity from 'mostly-entity';
import BlobEntity from 'playing-content-services/lib/entities/blob-entity';
import { DocTypes } from '~/constants';

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
  
  return obj.metadata;
});

ChapterEntity.excepts('destroyedAt');

export default ChapterEntity.asImmutable();
