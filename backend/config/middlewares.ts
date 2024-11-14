module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'http:', 'https:', 'https://api.borneodigital.co'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com', 'strapi.io', 'api.borneodigital.co'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          'style-src': ["'self'", "'unsafe-inline'"],
          'frame-src': ["'self'", 'data:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'https://hackwknd.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  async (ctx, next) => {
    console.log('CORS middleware applied');
    await next();
  },
];