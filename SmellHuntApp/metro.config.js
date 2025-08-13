// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  server: {
    // Listen on all addresses, not just localhost
    host: '0.0.0.0',
    // (optional) you can also explicitly set the port
    port: 8081,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
