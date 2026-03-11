// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './dist/app.js',
    instances: 1, // Start with 1 instance
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '512M',
    kill_timeout: 10000, // 10 seconds to gracefully shutdown
    listen_timeout: 30000, // 30 seconds to start
    shutdown_with_message: true,
    
    // Auto-restart settings
    exp_backoff_restart_delay: 100, // Wait between restarts
    max_restarts: 10, // Max restarts in a row
    min_uptime: '10s', // Minimum uptime before considering successful
    
    // Logs
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Environment
    env: {
      NODE_ENV: 'production',
      UV_THREADPOOL_SIZE: '2',
    },
    
    // Kill mechanism
    kill_retry_time: 3000, // Retry kill after 3 seconds
    shutdown_with_message: true,
    
    // Monitor
    instances: 1,
    max_memory_restart: '500M',
  }],
  
  // Auto-delete old processes
  // deploy: {
  //   production: {
  //     user: 'cpanel_user',
  //     host: 'localhost',
  //     ref: 'origin/main',
  //     repo: 'your-repo',
  //     path: '/home/cpanel_user/app',
  //     'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
}