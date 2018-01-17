import { iff, isProvider } from 'feathers-hooks-common';
import { hooks as auth } from 'feathers-authentication';
import { associateCurrentUser, queryWithCurrentUser } from 'feathers-authentication-hooks';
import { hooks } from 'mostly-feathers-mongoose';
import { hooks as content } from 'playing-content-services';
import BookEntity from '~/entities/book-entity';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
      ],
      get: [
        // queryWithCurrentUser({ idField: 'id', as: 'creator' })
      ],
      find: [
        // queryWithCurrentUser({ idField: 'id', as: 'creator' })
      ],
      create: [
        auth.authenticate('jwt'),
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        content.computePath({ type: 'book' }),
        content.fetchBlobs()
      ],
      update: [
        auth.authenticate('jwt'),
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        content.computePath({ type: 'book' }),
        hooks.discardPath('id', 'metadata', 'createdAt', 'updatedAt', 'destroyedAt'),
        content.fetchBlobs()
      ],
      patch: [
        auth.authenticate('jwt'),
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        content.computePath({ type: 'book' }),
        hooks.discardPath('id', 'metadata', 'createdAt', 'updatedAt', 'destroyedAt'),
        content.fetchBlobs()
      ],
      remove: [
        auth.authenticate('jwt')
      ]
    },
    after: {
      all: [
        iff(isProvider('external'), hooks.discardPath('ACL')),
        hooks.populate('parent', { service: 'folders', fallThrough: ['headers'] }),
        hooks.populate('creator', { service: 'users' }),
        hooks.presentEntity(BookEntity, options),
        content.documentEnrichers(options),
        hooks.responder()
      ],
      create: [
        hooks.publishEvent('document.create', { prefix: 'playing' })
      ]
    }
  };
};