/**
 * Usage:
 *   node scripts/add_routes_to_push_manifest.js
 */

const fs = require('fs');
const pushManifestPath = 'build/es6-unbundled/push-manifest.json';
const pushManifest = require(`../${pushManifestPath}`);
const newManifest = {};

const navigateRequestPreloads = {
  "bower_components/webcomponentsjs/webcomponents-lite.min.js": {
    "type": "script",
    "weight": 1
  }
};

let homePage = Object.assign({
    "src/news-app.html": {
      "type": "document",
      "weight": 1
    },
    "src/news-list.html": {
      "type": "document",
      "weight": 1
    }
  },
  pushManifest['/'],
  pushManifest['/list/.*'],
  pushManifest['src/news-app.html'],
  pushManifest['src/news-list.html'],
  navigateRequestPreloads);
newManifest['/'] = newManifest['/list/.*'] = homePage;

newManifest['/article/.*'] = Object.assign({
    "src/news-app.html": {
      "type": "document",
      "weight": 1
    },
    "src/news-article.html": {
      "type": "document",
      "weight": 1
    }
  },
  pushManifest['/article/.*'],
  pushManifest['src/news-app.html'],
  pushManifest['src/news-article.html'],
  navigateRequestPreloads);

// HACK(keanulee): need to dedup already pushed assets -
// https://github.com/Polymer/polymer-build/issues/260
const dedupedLazyResourcesAssets = {};
const lazyResourcesAssets = pushManifest['src/lazy-resources.html'];
Object.keys(lazyResourcesAssets).forEach((asset) => {
  if (!newManifest['/'][asset]) {
    dedupedLazyResourcesAssets[asset] = lazyResourcesAssets[asset];
  }
});
newManifest['src/lazy-resources.html'] = dedupedLazyResourcesAssets;

fs.writeFileSync(pushManifestPath, JSON.stringify(newManifest, null, 2));
