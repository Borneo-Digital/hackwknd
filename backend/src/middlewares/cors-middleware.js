'use strict';

/**
 * `cors-middleware` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    // Set CORS headers manually
    ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin || '*');
    ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight OPTIONS request
    if (ctx.method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }
    
    // Continue to next middleware
    await next();
  };
};