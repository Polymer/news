/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/app-layout/helpers/helpers.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import './news-data.js';
import './news-nav.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { scroll } from '@polymer/app-layout/helpers/helpers.js';

class NewsApp extends PolymerElement {
  static get template() {
    return html`
    <style>

      :host {
        display: block;
        position: relative;
        min-height: 100vh;
        padding-bottom: 64px;

        --app-border-style: 1px solid #CCC;
        --app-transparent-border-style: 1px solid rgba(255, 255, 255, 0.5);
        --app-button-border-style: 2px solid #222;
        --app-cover-text-color: #FFF;
        --app-nav-background-color: #222;
        --app-nav-text-color: #FFF;
        --app-nav-deselected-text-color: #CCC;
        --app-nav-selected-background-color: #555;

        --app-sub-section-headline: {
          border-top: var(--app-border-style);
          border-bottom: var(--app-border-style);
          font-size: 13px;
          padding: 8px;
          text-align: center;
        };

        /* use this value for the viewport height instead of "vh" unit */
        --viewport-height: 600px;
      }

      iron-pages {
        max-width: 1440px;
        margin: 0 auto;
      }

      footer {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        padding-bottom: 24px;
        text-align: center;
      }

      footer a {
        text-decoration: none;
        font-size: 13px;
        color: #757575;
      }

      footer a:hover {
        text-decoration: underline;
      }

      /* desktop */
      @media (min-width: 768px) {
        :host {
          margin: 0 40px;
        }
      }

    </style>

    <news-analytics key="UA-39334307-18"></news-analytics>

    <!--
      app-location and app-route elements provide the state of the URL for the app.
    -->
    <app-location route="{{route}}"></app-location>
    <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>

    <!--
      news-data provides the list of categories and the articles for the category.
    -->
    <news-data id="data" categories="{{categories}}" category-name="[[categoryName]]" category="{{category}}" article-id="[[articleId]]" article="{{article}}" loading="{{loading}}" offline="[[offline]]" failure="{{failure}}"></news-data>

    <news-nav id="nav" app-title="[[appTitle]]" page="[[page]]" categories="[[categories]]" category="[[category]]" load-complete="[[loadComplete]]">
      [[articleHeadline]]
    </news-nav>

    <iron-pages role="main" selected="[[page]]" attr-for-selected="name" fallback-selection="path-warning">
      <!-- list view of articles in a category -->
      <news-list id="list" name="list" route="[[subroute]]" category-name="{{categoryName}}" category="[[category]]" loading="[[loading]]" offline="[[offline]]" failure="[[failure]]"></news-list>
      <!-- article view -->
      <news-article name="article" route="{{subroute}}" category-name="{{categoryName}}" category="[[category]]" article-id="{{articleId}}" article="[[article]]" loading="[[loading]]" offline="[[offline]]" failure="[[failure]]"></news-article>
      <!-- invalid top level paths -->
      <news-path-warning name="path-warning"></news-path-warning>

    </iron-pages>

    <footer>
      <a href="https://www.polymer-project.org/3.0/toolbox/">Made by Polymer</a>
    </footer>
`;
  }

  static get is() { return 'news-app'; }

  static get properties() { return {

    appTitle: String,

    page: {
      type: String,
      observer: '_pageChanged'
    },

    routeData: Object,

    categories: Array,

    categoryName: String,

    category: Object,

    articleId: String,

    article: Object,

    articleHeadline: {
      type: String,
      value: ''
    },

    offline: {
      type: Boolean,
      value: false,
      readOnly: true
    },

    failure: Boolean,

    loadComplete: Boolean

  }}

  static get observers() { return [
    '_routePageChanged(routeData.page, isAttached)',
    '_updateArticleHeadline(article.headline)',
    '_updateDocumentTitle(page, category.title, articleHeadline, appTitle)'
  ]}

  ready() {
    super.ready();
    // Custom elements polyfill safe way to indicate an element has been upgraded.
    this.removeAttribute('unresolved');

    // Chrome on iOS recomputes "vh" unit when URL bar goes off screen. Since we use "vh" unit
    // to size the cover image and the title, those items will resize in response to the URL
    // bar being shown or hidden. FWIW, this is not an issue in Chrome 56 on Android or iOS
    // Safari. To workaround this on Chrome on iOS, we will use a
    // fixed viewport height in places where normally relying on "vh" unit and replace them with
    // custom property "--viewport-height".
    let ua = navigator.userAgent;
    let cMatch = navigator.userAgent.match(/Android.*Chrome[\/\s](\d+\.\d+)/);
    if (ua.match('CriOS') || (cMatch && cMatch[0] && cMatch[1] < 56)) {
      document.body.classList.add('fixed-viewport-height');
    }

    afterNextRender(this, () => {
      window.addEventListener('online', (e)=>this._notifyNetworkStatus(e));
      window.addEventListener('offline', (e)=>this._notifyNetworkStatus(e));
      this.addEventListener('refresh-data', (e)=>this._refreshData(e));
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.isAttached = true;
  }

  _routePageChanged(page, isAttached) {
    if (!isAttached) {
      return;
    }
    if (!page) {
      // set default route if route path is empty
      this.set('route.path', 'list/top_stories');
      return;
    }
    this.page = page;
    // Scroll to the top of the page on every *route* change. Use `scroll`
    // with `behavior: 'silent'` to disable header scroll effects during the scroll.
    scroll({ top: 0, behavior: 'silent' });
    // Close the drawer - in case the *route* change came from a link in the drawer.
    this.$.nav.closeDrawer();
  }

  _pageChanged(page, oldPage) {
    let cb = this._pageLoaded.bind(this, Boolean(oldPage));
    switch (page) {
      case 'list':
        import('./news-list.js').then(cb);
        break;
      case 'article':
        import('./news-article.js').then(cb);
        break;
      default:
        import('./news-path-warning.js').then(cb);
    }
  }

  _pageLoaded(shouldResetLayout) {
    this._ensureLazyLoaded();
  }

  _ensureLazyLoaded() {
    // load lazy resources after render and set `loadComplete` when done.
    if (!this.loadComplete) {
      afterNextRender(this, () => {
        import('./lazy-resources.js').then(() => {
          this._notifyNetworkStatus();
          this.loadComplete = true;

          // Load pre-caching Service Worker
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js', {scope: '/'});
          }
        });
      });
    }
  }

  _notifyNetworkStatus() {
    let oldOffline = this.offline;
    this._setOffline(!window.navigator.onLine);
    // Show the snackbar if the user is offline when starting a new session
    // or if the network status changed.
    if (this.offline || (!this.offline && oldOffline === true)) {
      if (!this._networkSnackbar) {
        this._networkSnackbar = document.createElement('news-snackbar');
        this.root.appendChild(this._networkSnackbar);
      }
      this._networkSnackbar.textContent = this.offline ?
          'You are offline' : 'You are online';
      this._networkSnackbar.open();
    }
  }

  _updateArticleHeadline(articleHeadline) {
    this.articleHeadline = articleHeadline;
  }

  // Elements in the app can notify section changes.
  // Response by a11y announcing the section and syncronizing the category.
  _updateDocumentTitle(page, categoryTitle, articleHeadline, appTitle) {
    document.title = (page === 'list' ? categoryTitle : articleHeadline) + ' - ' + appTitle;
    if (page === 'list') {
      this._setPageMetadata(categoryTitle, null);
    } else {
      this._setPageMetadata(articleHeadline, this.article);
    }
  }

  _setPageMetadata(description, article) {
    let image = article ? article.imageUrl : 'images/news-icon-128.png';

    // Set open graph metadata
    this._setMeta('property', 'og:title', document.title);
    this._setMeta('property', 'og:description', description || document.title);
    this._setMeta('property', 'og:url', document.location.href);
    this._setMeta('property', 'og:image', this.baseURI + image);

    // Set twitter card metadata
    this._setMeta('property', 'twitter:title', document.title);
    this._setMeta('property', 'twitter:description', description || document.title);
    this._setMeta('property', 'twitter:url', document.location.href);
    this._setMeta('property', 'twitter:image:src', this.baseURI + image);
  }

  _setMeta(attrName, attrValue, content) {
    let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
  }

  _refreshData() {
    this.$.data.refresh();
  }
}

customElements.define(NewsApp.is, NewsApp);
