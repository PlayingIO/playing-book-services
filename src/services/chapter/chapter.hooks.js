import { iff, isProvider } from 'feathers-hooks-common';
import { associateCurrentUser, queryWithCurrentUser } from 'feathers-authentication-hooks';
import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';
import contents from 'playing-content-common';
import { ChapterEntity } from 'playing-book-common';

export default function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth),
        cache(options.cache, { headers: ['enrichers-document'] })
      ],
      get: [
        // queryWithCurrentUser({ idField: 'id', as: 'creator' })
      ],
      find: [
        // queryWithCurrentUser({ idField: 'id', as: 'creator' })
      ],
      create: [
        hooks.authenticate('jwt', options.auth),
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        contents.computePath({ type: 'chapter' }),
        contents.computeAncestors(),
        contents.fetchBlobs({ xpaths: 'files' })
      ],
      update: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        hooks.discardFields('metadata', 'ancestors', 'createdAt', 'updatedAt', 'destroyedAt'),
        contents.computePath({ type: 'chapter' }),
        contents.computeAncestors(),
        contents.fetchBlobs({ xpaths: 'files' })
      ],
      patch: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        hooks.discardFields('metadata', 'ancestors', 'createdAt', 'updatedAt', 'destroyedAt'),
        contents.computePath({ type: 'chapter' }),
        contents.computeAncestors(),
        contents.fetchBlobs({ xpaths: 'files' })
      ]
    },
    after: {
      all: [
        hooks.populate('parent', { service: 'books', fallThrough: ['headers'] }),
        hooks.populate('ancestors'), // with typed id
        hooks.populate('creator', { service: 'users' }),
        contents.documentEnrichers(options),
        cache(options.cache, { headers: ['enrichers-document'] }),
        hooks.presentEntity(ChapterEntity, options.entities),
        hooks.responder()
      ],
      create: [
        contents.documentNotifier('document.create')
      ]
    }
  };
}