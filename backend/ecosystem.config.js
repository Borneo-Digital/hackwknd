module.exports = {
  apps: [
    {
      name: 'strapi',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
      max_memory_restart: '1G',
      exp_backoff_restart_delay: 100,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};