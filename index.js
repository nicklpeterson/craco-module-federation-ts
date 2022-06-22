require('typescript-require')({
  targetES5: true,
  exitOnError: true,
  emitOnError: true
});
const webpack = require("webpack");
const paths = require("react-scripts/config/paths");

console.log("-------------------------------------------------")
console.log("-------------------------------------------------")
console.log("-------------------------------------------------")
console.log("RUNNING CRACO-MOD-FED")
console.log("-------------------------------------------------")
console.log("-------------------------------------------------")
console.log("-------------------------------------------------")

const getModuleFederationConfigPath = (additionalPaths = []) => {
  const path = require("path");
  const fs = require("fs");
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

  const moduleFederationConfigFiles = [
    "modulefederation.config.js",
    "modulefederation.config.ts",
    ...additionalPaths,
  ];
  return moduleFederationConfigFiles
    .map(resolveApp)
    .filter(fs.existsSync)
    .shift();
};

module.exports = {
  overrideWebpackConfig: ({ webpackConfig, pluginOptions }) => {
    const moduleFederationConfigPath = getModuleFederationConfigPath();

    if (moduleFederationConfigPath) {
      webpackConfig.output.publicPath = "auto";

      if (pluginOptions?.useNamedChunkIds) {
        webpackConfig.optimization.chunkIds = "named";
      }

      const htmlWebpackPlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
      );

      htmlWebpackPlugin.userOptions = {
        ...htmlWebpackPlugin.userOptions,
        publicPath: paths.publicUrlOrPath,
        excludeChunks: [require(moduleFederationConfigPath).name],
      };

      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.container.ModuleFederationPlugin(
          require(moduleFederationConfigPath)
        ),
      ];

      // webpackConfig.module = {
      //   ...webpackConfig.module,
      //   generator: {
      //     "asset/resource": {
      //       publicPath: paths.publicUrlOrPath,
      //     },
      //   },
      // };
    }
    return webpackConfig;
  },
  overrideDevServerConfig: ({ devServerConfig }) => {
    devServerConfig.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    };

    return devServerConfig;
  },
};
