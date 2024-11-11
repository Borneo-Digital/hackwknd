import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::email.email', {
  only: ['send', 'send-template'], // Ensure 'send-template' is included
});