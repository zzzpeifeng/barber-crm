module.exports = {
  apps: [
    {
      name: 'barber-backend',
      script: 'npm',
      args: 'run start:prod',
      cwd: './packages/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'barber-h5',
      script: 'serve',
      args: '-s dist -l 3001',
      cwd: './packages/h5-merchant',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'barber-admin',
      script: 'serve',
      args: '-s dist -l 3002',
      cwd: './packages/admin-web',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
