module.exports = ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  // Add custom CORS middleware to ensure headers are set properly
  'global::cors-middleware',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:'],
          'img-src': ["'self'", 'data:', 'blob:', 'dl.airtable.com', 'res.cloudinary.com', '*.hackwknd.sarawak.digital'],
          'media-src': ["'self'", 'data:', 'blob:', 'dl.airtable.com', 'res.cloudinary.com', '*.hackwknd.sarawak.digital'],
          upgradeInsecureRequests: null,
        },
      },
      frameguard: {
        action: 'sameorigin',
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      // Explicitly list all allowed origins
      origin: [
        'http://localhost:3000',
        'https://hackwknd.sarawak.digital',
        'https://www.hackwknd.sarawak.digital',
        'https://hackwknd-git-add-content-digital-sarawak-experience-centre.vercel.app'
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      credentials: true,
      maxAge: 86400, // 24 hours in seconds
      expose: ['Content-Range', 'X-Content-Range'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
