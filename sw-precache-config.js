module.exports = {
  staticFileGlobs: [
    'manifest.json',
    'images/*',
    'src/**/*'
  ],
  runtimeCaching: [
    {
      urlPattern: /\/@webcomponents\/webcomponentsjs\//,
      handler: 'fastest'
    },
    {
      urlPattern: /.*\.(png|jpg|gif|svg)/i,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 200,
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
