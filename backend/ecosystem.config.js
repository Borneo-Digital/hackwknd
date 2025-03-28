module.exports = {
  apps: [
    {
      name: 'strapi',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=512'
      },
      watch: false,
      max_memory_restart: '512M',
      exp_backoff_restart_delay: 100,
      env_production: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=512'
      },
    },
  ],
};