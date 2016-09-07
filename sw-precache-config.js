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
      urlPattern: /^https:\/\/static01\.nyt\.com\/images/,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 200,
          name: 'images-cache'
        }
      }
    },
    {
      urlPattern: /^https:\/\/api\.nytimes\.com\/svc/,
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
