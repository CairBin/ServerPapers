module.exports = {
  apps: [
    {
      name: 'ServerPapers',
      script: 'build/App.js', // 编译后的入口文件
      watch: false, // 生产环境通常关闭监听
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};