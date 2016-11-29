module.exports = {
  staticFileGlobs: [
    '/manifest.json',
    '/bower_components/webcomponentsjs/webcomponents-lite.min.js',
    '/images/*'
  ],
  dynamicUrlToDependencies: {
    '/': ['index.html']
  },
  navigateFallback: '/',
  navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/],
  runtimeCaching: [
    {
      urlPattern: /(https?:\/\/.*\.(?:png|jpg|gif|svg))/i,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 200,
          name: 'ext-images-cache'
        }
      }
    },
    {
      urlPattern: /\/data\/images\/.*/,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 100,
          name: 'data-images-cache'
        }
      }
    },
    {
      urlPattern: /\/data\/articles\/.*/,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 100,
          name: 'data-articles-cache'
        }
      }
    },
    {
      urlPattern: /\/data\/.*json/,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 10,
          name: 'data-json-cache'
        }
      }
    }
  ]
};
