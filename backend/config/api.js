module.exports = {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
    prefix: '/api',
    // Ensure proper CORS headers for all API responses
    defaultSecurity: {
      enabled: true,
    },
  },
};