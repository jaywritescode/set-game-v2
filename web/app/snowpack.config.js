/** @type {import("snowpack").SnowpackUserConfig } */

const proxy = require('http2-proxy');

module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: ['@snowpack/plugin-react-refresh', '@snowpack/plugin-dotenv'],
  routes: [
    {
      src: '/api/.*',
      dest: (req, res) => {
        req.url = req.url.replace(/^\/api/, '');
        return proxy.web(req, res, {
          hostname: 'localhost',
          port: 8899,
        });
      },
    },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    polyfillNode: true,
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
