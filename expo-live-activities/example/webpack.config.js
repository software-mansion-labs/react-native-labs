const createConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async (env, argv) => {
  const config = await createConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-widget-extension-local'],
      },
    },
    argv
  );

  config.externals = {
    'react': 'react',
    'react-native': 'react-native',
    'react-dom': 'react-dom',
    'react-router-dom': 'react-router-dom',
    'react-router': 'react-router'
  }

  config.resolve.modules = [
    path.resolve(__dirname, './node_modules'),
    path.resolve(__dirname, '../node_modules'),
  ];

  return config;
};
