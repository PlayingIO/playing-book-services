import { iff, isProvider } from 'feathers-hooks-common';
import { associateCurrentUser, queryWithCurrentUser } from 'feathers-authentication-hooks';
import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';
import { hooks as content } from 'playing-content-services';

import BookEntity from '~/entities/book.entity';

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
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        content.computePath({ type: 'book' })
      ],
      update: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        hooks.discardFields('metadata', 'ancestors', 'createdAt', 'updatedAt', 'destroyedAt'),
        content.computePath({ type: 'book' }),
        content.computeAncestors()
      ],
      patch: [
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        hooks.discardFields('metadata', 'ancestors', 'createdAt', 'updatedAt', 'destroyedAt'),
        content.computePath({ type: 'book' }),
        content.computeAncestors()
      ]
    },
    after: {
      all: [
        hooks.populate('parent', { service: 'folders', fallThrough: ['headers'] }),
        hooks.populate('ancestors'), // with typed id
        hooks.populate('creator', { service: 'users' }),
        content.documentEnrichers(options),
        cache(options.cache, { headers: ['enrichers-document'] }),
        hooks.presentEntity(BookEntity, options.entities),
        hooks.responder()
      ],
      create: [
        hooks.publishEvent('document.created', { prefix: 'playing' })
      ]
    }
  };
}