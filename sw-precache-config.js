module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/manifest.json',
    '/bower_components/webcomponentsjs/webcomponents-lite.min.js',
    '/images/*'
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/img\.washingtonpost\.com|https:\/\/www\.washingtonpost\.com\/pb\/resources\/img/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 200,
          name: 'images-cache'
        }
      }
    },
    {
      urlPattern: /^https:\/\/www\.washingtonpost\.com\/pwa\/api/,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 100,
          name: 'data-cache'
        }
      }
    }
  ]
};
