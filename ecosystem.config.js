export default {
  apps: [{
    name: '1m-project',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      PORT: 3000,
      NODE_ENV: 'production'
    },
    env_development: {
      PORT: 3000,
      NODE_ENV: 'development'
    }
  }]
}; 