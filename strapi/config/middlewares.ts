module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'http:', 'https:', 'https://api.hackwknd.sarawak.digital'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com', 'strapi.io', 'api.hackwknd.sarawak.digital'],
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
      origin: ['https://hackwknd.sarawak.digital'], 
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
        'Access-Control-Allow-Headers'
      ],
      exposedHeaders: [ // Changed from 'exposed' to 'exposedHeaders'
        'Content-Range',
        'X-Total-Count',
        'Access-Control-Allow-Origin'
      ],
      keepHeaderOnError: true,
      credentials: true,
      maxAge: 86400 // Optional: Cache preflight response for 1 day
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public'
]