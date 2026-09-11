module.exports = {
  apps: [
    {
      name: "blog",
      script: "npm",
      args: "run start",
      cwd: __dirname,
      env: { NODE_ENV: "production", PORT: 3000 },
      autorestart: true,
      max_restarts: 10,
      instances: 1,
    },
    {
      name: "blog-worker",
      script: "npm",
      args: "run worker",
      cwd: __dirname,
      env: { NODE_ENV: "production" },
      autorestart: true,
      max_restarts: 10,
      instances: 1,
    },
  ],
};
