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
      src: '/start',
      dest: (req, res) => proxy.web(req, res, {
        hostname: 'localhost',
        port: 8000,
      }),
    },
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
