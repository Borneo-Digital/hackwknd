'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/api/hackathons',
      handler: 'api::hackathon.hackathon.find',
      config: {
        cors: {
          enabled: true,
          origin: ['*']
        }
      }
    },
    {
      method: 'GET',
      path: '/api/hackathons/:id',
      handler: 'api::hackathon.hackathon.findOne',
      config: {
        cors: {
          enabled: true,
          origin: ['*']
        }
      }
    },
    {
      method: 'POST',
      path: '/api/registrations',
      handler: 'api::registration.registration.create',
      config: {
        cors: {
          enabled: true,
          origin: ['*']
        }
      }
    }
  ]
};