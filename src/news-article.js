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

import '@polymer/app-route/app-route.js';
import '@polymer/iron-icon/iron-icon.js';
import './news-article-cover.js';
import './news-side-list.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { scroll } from '@polymer/app-layout/helpers/helpers.js';

class NewsArticle extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
      }

      [hidden] {
        display: none !important;
      }

      .container {
        display: flex;
      }

      .container .fade-in {
        opacity: 0;
      }

      .container[fade-in] .fade-in {
        opacity: 1;
        transition: opacity 500ms;
      }

      .flex {
        flex: 1;
      }

      .preview-cover {
        display: none;
      }

      #content {
        font-size: 16px;
        line-height: 26px;
      }

      #content img {
        max-width: 100%;
      }

      #content figure {
        margin-left: 0;
        margin-right: 0;
        font-style: italic;
        color: #999;
      }

      #content a {
        color: inherit;
        font-weight: bold;
      }

      #content .byline {
        font-weight: bold;
      }

      aside {
        margin-left: 24px;
        width: 300px;
      }

      news-side-list {
        margin-bottom: 32px;
      }

      news-gpt-ad {
        display: block;
        width: 300px;
        height: 250px;
      }

      .share-link {
        display: inline-block;
        margin-right: 24px;
        margin-bottom: 24px;
        color: inherit;
        font-size: 11px;
        font-weight: bold;
        text-decoration: none;
      }

      .share-link iron-icon {
        margin-right: 8px;
      }

      .ad-container {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
      }

      /* mobile */
      @media (max-width: 767px) {
        .container {
          display: block;
        }

        .preview-cover {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1;
        }

        #content {
          padding: 24px;
        }

        aside {
          margin-left: auto;
          width: auto;
          padding: 0 24px;
        }

        .share-link {
          display: none;
        }
      }

      /* mobile and desktop small */
      @media (max-width: 1309px) {
        h1 {
          font-size: 6vh;
          line-height: 7vh;
          max-height: calc(7vh * 7);
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 7;
          -webkit-box-orient: vertical;
        }

        :host-context(.fixed-viewport-height) h1 {
          font-size: calc(var(--viewport-height) * 0.06);
          line-height: calc(var(--viewport-height) * 0.07);
          max-height: calc(var(--viewport-height) * 0.49);
        }
      }
    </style>

    <app-route
        route="{{route}}"
        pattern="/:category/:id"
        data="{{_routeData}}"></app-route>

    <div class="container" fade-in$="[[!loading]]" hidden$="[[failure]]">
      <article class="flex">
        <news-article-cover id="cover0" class="fade-in"></news-article-cover>
        <news-article-cover id="cover1" class="preview-cover"></news-article-cover>
        <news-article-cover id="cover2" class="preview-cover"></news-article-cover>
        <div id="content" class="fade-in"></div>
      </article>

      <aside>
        <div class="ad-container">
          <news-gpt-ad id="ad_slot_2"
              ad-unit-path="/6355419/Travel/Europe/France/Paris"
              ad-width="300" ad-height="250"></news-gpt-ad>
        </div>
        <a href="#" class="share-link" aria-label="Send by email">
          <iron-icon icon="mail"></iron-icon> Email
        </a>
        <a href="#" class="share-link" aria-label="Share on social networks">
          <iron-icon icon="share"></iron-icon> Share
        </a>
        <news-side-list class="fade-in" items="[[_slice(category.items, 0, 3)]]">
          Most Read
        </news-side-list>
        <news-side-list class="fade-in" featured items="[[_slice(category.items, 3, 9)]]">
          Top Stories
        </news-side-list>
      </aside>
    </div>

    <news-network-warning
        hidden$="[[!failure]]"
        offline="[[offline]]"
        on-try-reconnect="_tryReconnect"></news-network-warning>
`;
  }

  static get is() { return 'news-article'; }

  static get properties() { return {

    route: Object,

    category: Object,

    article: Object,

    previousArticle: {
      type: Object,
      computed: '_computePreviousArticle(category.items, article)'
    },

    nextArticle: {
      type: Object,
      computed: '_computeNextArticle(category.items, article)'
    },

    loading: Boolean,

    offline: Boolean,

    failure: Boolean,

    categoryName: {
      type: Boolean,
      computed: '_return(_routeData.category)',
      notify: true
    },

    articleId: {
      type: Boolean,
      computed: '_return(_routeData.id)',
      notify: true
    },

    _routeData: Object

  }}

  static get observers() { return [
    '_loadArticle(article.html)',
    '_articleChanged(article)'
  ]}

  connectedCallback() {
    super.connectedCallback();
    this._currentArticleCover = this.$.cover0;
    this._previousArticleCover = this.$.cover1;
    this._nextArticleCover = this.$.cover2;

    this._currentArticleCover.article = this.article;

    afterNextRender(this, this._installListeners);
  }

  _installListeners() {
    this._desktopMediaQuery = window.matchMedia('(min-width: 768px)');
    this.addEventListener('touchstart', this._touchstart.bind(this));
    this.addEventListener('touchmove', this._touchmove.bind(this));
    this.addEventListener('touchend', this._touchend.bind(this));
  }

  _touchstart(event) {
    if (this._isDesktopWidth()) {
      return;
    }

    // Save start coordinates
    if (!this._touchDir) {
      this._startX = event.changedTouches[0].clientX;
      this._startY = event.changedTouches[0].clientY;
    }

    if (this.previousArticle) {
      this._previousArticleCover.article = this.previousArticle;
    }
    if (this.nextArticle) {
      this._nextArticleCover.article = this.nextArticle;
    }
  }

  _touchmove(event) {
    if (this._isDesktopWidth()) {
      return;
    }

    // Is touchmove mostly horizontal or vertical?
    if (!this._touchDir) {
      const absX = Math.abs(event.changedTouches[0].clientX - this._startX);
      const absY = Math.abs(event.changedTouches[0].clientY - this._startY);
      this._touchDir = absX > absY ? 'x' : 'y';
    }

    if (this._touchDir === 'x') {
      // Prevent vertically scrolling when swiping
      event.preventDefault();

      let dx = Math.round(event.changedTouches[0].clientX - this._startX);

      // Don't translate past the current image if there's no adjacent image in that direction
      if ((!this.previousArticle && dx > 0) || (!this.nextArticle && dx < 0)) {
        dx = 0;
      }

      if (this.previousArticle) {
        this._translate(this._previousArticleCover, dx - this.offsetWidth, window.pageYOffset);
      }
      if (this.nextArticle) {
        this._translate(this._nextArticleCover, dx + this.offsetWidth, window.pageYOffset);
      }
    }
  }

  _touchend(event) {
    if (this._isDesktopWidth()) {
      return;
    }

    // Don't finish swiping if there are still active touches.
    if (event.touches.length) {
      return;
    }

    if (this._touchDir === 'x') {
      let dx = Math.round(event.changedTouches[0].clientX - this._startX);

      // Don't translate past the current image if there's no adjacent image in that direction
      if ((!this.previousArticle && dx > 0) || (!this.nextArticle && dx < 0)) {
        dx = 0;
      }

      if (dx > 0) {
        if (dx > 100) {
          this._translate(this._previousArticleCover, 0, window.pageYOffset, true /* transition */);
          window.setTimeout(() => {
            this.set('_routeData.id', this.previousArticle.id);
            scroll({ top: 0 });
            this._previousArticleCover = this._swapCurrentArticleCovers(this._previousArticleCover);
            this._resetElementStyles(this._nextArticleCover);
          }, 200);
        } else {
          this._translate(this._previousArticleCover, -this.offsetWidth, window.pageYOffset, true /* transition */);
          window.setTimeout(() => {
            this._resetElementStyles(this._previousArticleCover);
            this._resetElementStyles(this._nextArticleCover);
          }, 200);
        }
      } else if (dx < 0) {
        if (dx < -100) {
          this._translate(this._nextArticleCover, 0, window.pageYOffset, true /* transition */);
          window.setTimeout(() => {
            this.set('_routeData.id', this.nextArticle.id);
            scroll({ top: 0 });
            this._nextArticleCover = this._swapCurrentArticleCovers(this._nextArticleCover);
            this._resetElementStyles(this._previousArticleCover);
          }, 200);
        } else {
          this._translate(this._nextArticleCover, this.offsetWidth, window.pageYOffset, true /* transition */);
          window.setTimeout(() => {
            this._resetElementStyles(this._previousArticleCover);
            this._resetElementStyles(this._nextArticleCover);
          }, 200);
        }
      }
    }

    // Reset touch direction
    this._touchDir = null;
  }

  _translate(elem, x, y, transition) {
    elem.style.display = 'block';
    elem.style.transition = transition ? 'transform 0.2s' : '';
    elem.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
  }

  _resetElementStyles(elem) {
    elem.style.display = '';
    elem.style.transition = '';
    elem.style.transform = '';
  }

  _swapCurrentArticleCovers(newCover) {
    const oldCover = this._currentArticleCover;
    oldCover.classList.remove('fade-in');
    oldCover.classList.add('preview-cover');

    this._resetElementStyles(newCover);
    newCover.classList.remove('preview-cover');
    this._currentArticleCover = newCover;
    newCover.parentElement.insertBefore(newCover, oldCover);

    return oldCover;
  }

  _isDesktopWidth() {
    return this._desktopMediaQuery.matches;
  }

  _loadArticle(html) {
    // If this._currentArticleCover isn't defined here, then it hasn't been stamped yet, and
    // the template already has the `fade-in` class.
    if (this._currentArticleCover) {
      this._currentArticleCover.classList.add('fade-in');
    }
    this.$.content.innerHTML = html;
    //ShadyCSS.styleSubtree(this.$.content);
  }

  _articleChanged(article) {
    // If this._currentArticleCover isn't defined here, then `attached()` (which hasn't been
    // run yet) will set the article.
    if (this._currentArticleCover) {
      this._currentArticleCover.article = article;
    }
  }

  _tryReconnect() {
    this.dispatchEvent(new CustomEvent('refresh-data', {bubbles: true, composed: true}));
  }

  _slice(list, begin, end) {
    if (list) {
      return list.slice(begin, end);
    }
  }

  _return(value) {
    return value;
  }

  _computePreviousArticle(categoryItems, article) {
    if (categoryItems) {
      const i = categoryItems.indexOf(article);
      return i > 0 ? categoryItems[i-1] : null;
    }
  }

  _computeNextArticle(categoryItems, article) {
    if (categoryItems) {
      const i = categoryItems.indexOf(article);
      return (i > -1 && i < categoryItems.length-1) ? categoryItems[i+1] : null;
    }
  }
}

customElements.define(NewsArticle.is, NewsArticle);
