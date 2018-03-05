import { iff, isProvider } from 'feathers-hooks-common';
import { hooks as auth } from 'feathers-authentication';
import { associateCurrentUser, queryWithCurrentUser } from 'feathers-authentication-hooks';
import { hooks } from 'mostly-feathers-mongoose';
import { hooks as content } from 'playing-content-services';
import ChapterEntity from '~/entities/chapter-entity';

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
        content.computePath({ type: 'chapter' }),
        content.fetchBlobs({ xpaths: 'files' })
      ],
      update: [
        auth.authenticate('jwt'),
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        content.computePath({ type: 'chapter' }),
        hooks.discardFields('id', 'metadata', 'createdAt', 'updatedAt', 'destroyedAt'),
        content.fetchBlobs({ xpaths: 'files' })
      ],
      patch: [
        auth.authenticate('jwt'),
        iff(isProvider('external'),
          associateCurrentUser({ idField: 'id', as: 'creator' })),
        hooks.depopulate('parent'),
        content.computePath({ type: 'chapter' }),
        hooks.discardFields('id', 'metadata', 'createdAt', 'updatedAt', 'destroyedAt'),
        content.fetchBlobs({ xpaths: 'files' })
      ],
      remove: [
        auth.authenticate('jwt')
      ]
    },
    after: {
      all: [
        iff(isProvider('external'), hooks.discardFields('ACL')),
        hooks.populate('parent', { service: 'books', fallThrough: ['headers'] }),
        hooks.populate('creator', { service: 'users' }),
        hooks.presentEntity(ChapterEntity, options),
        content.documentEnrichers(options),
        hooks.responder()
      ],
      create: [
        hooks.publishEvent('document.create', { prefix: 'playing' })
      ]
    }
  };
};