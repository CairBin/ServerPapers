module.exports = {
  apps: [
    {
      name: "ServerPapers",
      script: "./src/App.ts",
      interpreter: "./node_modules/.bin/ts-node",
      exec_mode: "cluster",
    },
  ],
};
