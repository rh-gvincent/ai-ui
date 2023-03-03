const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const insightsProxy = {
  https: false,
  ...(process.env.BETA && { deployment: 'beta/apps' }),
};

const webpackProxy = {
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  proxyVerbose: true,
  interceptChromeConfig: true,
  env: `${process.env.ENVIRONMENT || 'stage'}-${process.env.BETA ? 'beta' : 'stable'}`, // for accessing prod-beta start your app with ENVIRONMENT=prod and BETA=true
  appUrl: process.env.BETA ? '/beta/ai' : '/ai',
};

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  sassPrefix: '.ai',
  ...(process.env.PROXY ? webpackProxy : insightsProxy),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    exposes:{
        './RootApp': resolve(__dirname, '../src/AppEntry.tsx'),
        './SampleComponent': resolve(__dirname, '../src/Components/SampleComponent/sample-component.tsx'),
    }
  })
);

webpackConfig.devServer.client.overlay = false;

module.exports = {
  ...webpackConfig,
  plugins,
};
