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

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './news-img.js';

class NewsListFeaturedItem extends PolymerElement {
  static get template() {
    return html`
    <style>

      :host {
        display: block;
      }

      a {
        display: block;
        position: relative;
        text-decoration: none;
        color: inherit;
        overflow: hidden;
      }

      .img-container {
        position: relative;
      }

      h2 {
        margin: 18px 0;
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
      }

      .category {
        padding: 6px 20px 7px 20px;
        border: var(--app-border-style);
        display: inline-block;
        font-weight: bold;
        font-size: 11px;
      }

      .category[hidden] {
        display: none;
      }

      .details {
        @apply --layout-horizontal;
        font-size: 11px;
        font-weight: bold;
      }

      .time-ago {
        white-space: nowrap;
      }

      .author {
        padding-left: 35px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      p {
        margin: 0;
        line-height: 26px;
        font-size: 16px;
      }

      /* mobile and desktop small */
      @media (max-width: 1309px) {
        a {
          height: 100vh;
          background: #000;
          color: var(--app-cover-text-color);
        }

        :host-context(.fixed-viewport-height) a {
          height: var(--viewport-height);
        }

        news-img {
          min-height: 60vh;
        }

        :host-context(.fixed-viewport-height) news-img {
          min-height: calc(var(--viewport-height) * 0.6);
        }

        .scrim {
          @apply --layout-fit;
          background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 25%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%);
        }

        .headline {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px;
        }

        h2 {
          margin: 24px 0;
          font-size: 6vh;
          line-height: 7vh;
          max-height: calc(7vh * 7);
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 7;
          -webkit-box-orient: vertical;
        }

        :host-context(.fixed-viewport-height) h2 {
          font-size: calc(var(--viewport-height) * 0.06);
          line-height: calc(var(--viewport-height) * 0.07);
          max-height: calc(var(--viewport-height) * 0.49);
        }

        .category {
          border: var(--app-transparent-border-style);
        }

        .details {
          height: 19px;
          border-top: var(--app-transparent-border-style);
          padding-top: 29px;
        }

        p {
          display: none;
        }
      }

      /* desktop small */
      @media (min-width: 768px) and (max-width: 1309px) {
        a {
          height: 50vmax;
        }
      }

      /* desktop large */
      @media (min-width: 1310px) {
        a {
          @apply --layout-horizontal;
        }

        h2 {
          font-size: 38px;
          line-height: 48px;
        }

        news-img {
          @apply --layout-fit;
        }

        .img-container {
          width: 472px;
          min-width: 472px;
          min-height: 340px;
          margin-right: 24px;
        }

        .details {
          padding: 24px 0;
          border-top: var(--app-border-style);
        }
      }

    </style>

    <a href\$="[[item.href]]">
      <div class="img-container">
        <news-img alt="[[item.headline]]" src="[[item.imageUrl]]" placeholder-src="[[item.placeholder]]"></news-img>
        <div class="scrim"></div>
      </div>
      <div class="headline">
        <div class="category" hidden\$="[[!item.category]]">[[item.category]]</div>
        <h2>[[item.headline]]</h2>
        <div class="details">
          <div class="time-ago">[[item.timeAgo]]</div>
          <div class="author">[[item.author]]</div>
        </div>
        <p>[[item.summary]]</p>
      </div>
    </a>
`;
  }

  static get is() { return 'news-list-featured-item'; }

  static get properties() { return {

    item: Object

  }}
}

customElements.define(NewsListFeaturedItem.is, NewsListFeaturedItem);
