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
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 200,
          name: 'images-cache'
        }
      }
    },
    {
      urlPattern: /^https:\/\/pwa\.washingtonpost\.com\/api/,
      handler: 'networkFirst',
      options: {
        cache: {
          maxEntries: 100,
          name: 'data-cache'
        }
      }
    }
  ]
};
