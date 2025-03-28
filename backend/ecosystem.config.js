module.exports = {
  apps: [{
    name: 'strapi',
    cwd: '/var/www/hackwknd/backend',
    script: 'npm',
    args: 'run start',
    env: {
      NODE_ENV: 'production',
      DATABASE_CLIENT: 'sqlite',
      DATABASE_FILENAME: '.tmp/data.db',
      HOST: '0.0.0.0',
      PORT: 1337,
      PUBLIC_URL: 'https://api.hackwknd.sarawak.digital',
      NODE_OPTIONS: '--max-old-space-size=4096'
    },
    error_file: '/var/www/hackwknd/logs/strapi-error.log',
    out_file: '/var/www/hackwknd/logs/strapi-out.log',
    time: true,
    // Add these additional options for better reliability
    restart_delay: 3000,       // Wait 3 seconds between restarts
    max_restarts: 10,          // Restart at most 10 times
    max_memory_restart: '1G',  // Restart if memory usage exceeds 1GB
    kill_timeout: 5000,        // Wait 5 seconds before forcing kill
    watch: false,              // Disable file watching in production
    ignore_watch: ['.tmp', 'node_modules', 'public/uploads'], // Ignore these directories if watch is enabled
    exec_mode: 'fork',         // Run in fork mode
    instances: 1,              // Run a single instance
    autorestart: true          // Auto restart if app crashes
  }]
}