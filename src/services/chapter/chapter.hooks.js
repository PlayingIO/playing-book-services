import { iff, isProvider } from 'feathers-hooks-common';
import { associateCurrentUser, queryWithCurrentUser } from 'feathers-authentication-hooks';
import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';
import { hooks as content } from 'playing-content-services';

import ChapterEntity from '~/entities/chapter.entity';

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
        content.computePath({ type: 'chapter' }),
        content.fetchBlobs({ xpaths: 'files' })
      ],
      update: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        hooks.discardFields('id', 'metadata', 'ancestors', 'createdAt', 'updatedAt', 'destroyedAt'),
        content.computePath({ type: 'chapter' }),
        content.computeAncestors(),
        content.fetchBlobs({ xpaths: 'files' })
      ],
      patch: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        hooks.discardFields('id', 'metadata', 'ancestors', 'createdAt', 'updatedAt', 'destroyedAt'),
        content.computePath({ type: 'chapter' }),
        content.computeAncestors(),
        content.fetchBlobs({ xpaths: 'files' })
      ]
    },
    after: {
      all: [
        hooks.populate('parent', { service: 'books', fallThrough: ['headers'] }),
        hooks.populate('ancestors'), // with typed id
        hooks.populate('creator', { service: 'users' }),
        cache(options.cache, { headers: ['enrichers-document'] }),
        hooks.presentEntity(ChapterEntity, options.entities),
        content.documentEnrichers(options),
        hooks.responder()
      ],
      create: [
        hooks.publishEvent('document.create', { prefix: 'playing' })
      ]
    }
  };
}