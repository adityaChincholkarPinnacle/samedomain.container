const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

module.exports = {
  webpack(config: any, options: any) {
    const { isServer } = options;

    config.plugins.push(
      new NextFederationPlugin({
        name: "container",
        filename: "static/chunks/remoteEntry.js",
        remotes: {
          dashboard: `dashboard@https://samedomain-dashboard-plkiqkjnd-aditya-s-projects-03b412df.vercel.app/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`,
          remote2: `remote2@https://samedomain-remote2-of870l30h-aditya-s-projects-03b412df.vercel.app/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`,
        },
        exposes: {},
        shared: {
          react: {
            singleton: true,
            requiredVersion: false,
            eager: true,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: false,
            eager: true,
          },
        },
      })
    );

    return config;
  },
};
