const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

module.exports = {
  webpack(config: any, options: any) {
    const { isServer } = options; 

    config.plugins.push(
      new NextFederationPlugin({
        name: "container", 
        filename: "static/chunks/remoteEntry.js",
        remotes: {
          dashboard: `dashboard@http://localhost:3001/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`,
          remote2: `remote2@http://localhost:3002/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`,
        },
        exposes: {},
        shared: {
          react: { 
            singleton: true, 
            requiredVersion: false,
            eager: true 
          },
          "react-dom": { 
            singleton: true, 
            requiredVersion: false,
            eager: true 
          },
        },
      })
    );

    return config;
  },
};
