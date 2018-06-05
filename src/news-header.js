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

import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-selector/iron-selector.js';

class NewsHeader extends PolymerElement {
  static get template() {
    return html`
    <style>

      paper-icon-button {
        --paper-icon-button-ink-color: var(--app-nav-text-color);
        width: 40px;
      }

      header,
      .sticky-nav {
        z-index: 10;
      }

      .logo {
        text-align: center;
      }

      .date-line,
      .article-headline {
        text-align: center;
        font-size: 11px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: 0 16px;
      }

      .logo a {
        font-weight: 600;
        letter-spacing: 10px;
        /* To offset letter-spacing for the last character. */
        margin-right: -10px;
        text-decoration: none;
        /* required for IE 11, so this <a> can receive pointer events */
        display: inline-block;
        pointer-events: auto;
        color: inherit;
      }

      .menu-list {
        display: block;
        text-align: center;
        font-size: 13px;
        border-top: var(--app-border-style);
        border-bottom: var(--app-border-style);
        padding: 8px 0;
        margin: 32px 0;
      }

      .menu-list a {
        color: inherit;
        text-decoration: none;
        margin: 0 10px;
        letter-spacing: 0.08em;
      }

      .menu-list a.iron-selected {
        letter-spacing: 0em;
        font-weight: bold;
      }

      .sticky-nav {
        position: fixed;
        top: -1px;
        left: 0;
        right: 0;
        color: var(--app-nav-text-color);
        visibility: hidden;
        pointer-events: none;
        transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
        transform: translate3d(0, -100%, 0);
      }

      .sticky-nav[threshold-triggered] {
        visibility: visible;
        pointer-events: auto;
        transform: translate3d(0, 0, 0);
      }

      .sticky-nav .sticky-nav-toolbar {
        background: var(--app-nav-background-color);
      }

      :host([page=list]) .sticky-nav .sticky-nav-center {
        margin-right: 40px;
      }

      :host([page=list]) .sticky-nav paper-icon-button[icon=mail],
      :host([page=list]) .sticky-nav paper-icon-button[icon=share] {
        display: none;
      }

      .sticky-nav-menu {
        display: none;
      }

      .sticky-nav-menu a {
        display: block;
        line-height: 32px;
        font-size: 15px;
        text-decoration: none;
        color: var(--app-nav-deselected-text-color);
      }

      .sticky-nav-menu a.iron-selected {
        font-weight: bold;
        color: var(--app-nav-text-color);
      }

      /* mobile */
      @media (max-width: 767px) {
        header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          color: var(--app-cover-text-color);
        }

        header .logo {
          margin-right: 40px;
        }

        header .date-line {
          padding: 6px 0;
          border-top: var(--app-transparent-border-style);
          border-bottom: var(--app-transparent-border-style);
        }

        :host([page=article]) header .logo,
        :host([page=article]) header .date-line {
          visibility: hidden;
        }

        .sticky-nav .logo,
        :host([page=article]) .sticky-nav .date-line,
        :host([page=list]) .sticky-nav .article-headline {
          display: none;
        }

        /* Can't use flex because we need a fixed width to clip text overflow. */
        :host([page=article]) .sticky-nav-center {
          width: calc(100% - 120px); /* 40px * 3 buttons */
        }

        /* Can't use flex because we need a fixed width to clip text overflow. */
        :host([page=list]) .sticky-nav-center {
          width: calc(100% - 80px); /* 40px * 2 buttons */
        }
      }

      /* desktop */
      @media (min-width: 768px) {
        .logo {
          font-size: 39px;
        }

        .logo-toolbar {
          margin-top: 40px;
          height: 45px;
        }

        .mobile-toggle-drawer-btn {
          display: none;
        }

        .sticky-nav-toolbar {
          height: auto;
        }

        .sticky-nav {
          height: auto;
        }

        :host([page=article]) .sticky-nav .sticky-nav-center {
          margin-left: 40px;
        }

        .sticky-nav .logo a {
          color: inherit;
        }

        .sticky-nav .logo {
          font-size: 23px;
          padding-top: 16px;
        }

        .sticky-nav .date-line {
          padding: 4px 0 14px;
        }

        .sticky-nav .article-headline {
          display: none;
        }

        .sticky-nav-center {
          flex: 1;
        }

        .sticky-nav-menu {
          @apply --layout-vertical;
          @apply --layout-center;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--app-nav-background-color);
          transition: transform 0.2s ease-in-out;
          will-change: transform;
          z-index: -1;
          padding-top: 20px;
          padding-bottom: 40px;
        }

        .grid-container {
          -moz-column-count: 3;
          -moz-column-gap: 82px;
          column-count: 3;
          column-gap: 82px;
        }

        .sticky-nav[threshold-triggered] .sticky-nav-menu[shown] {
          transform: translate3d(0, 100%, 0);
        }
      }

    </style>

    <!--
      Header at the scroll top of the page.
    -->
    <header>
      <app-toolbar class="logo-toolbar">
        <paper-icon-button class="mobile-toggle-drawer-btn" icon="menu" on-click="_toggleDrawer" aria-label="Main navigation"></paper-icon-button>
        <div class="logo" main-title="">
          <a href="/" aria-label\$="[[_computeAppHomeLabel(appTitle)]]">[[appTitle]]</a>
        </div>
      </app-toolbar>
      <div class="date-line" role="heading">
        [[category.title]] <span aria-hidden="true">&nbsp;·&nbsp;</span> [[_currentTime()]]
      </div>
      <dom-if if="[[!smallScreen]]">
        <template>
          <iron-selector role="navigation" class="menu-list" selected="[[category.name]]" attr-for-selected="name">
            <dom-repeat items="[[categories]]" as="category" initial-count="9">
              <template>
                <a name="[[category.name]]" href="/list/[[category.name]]">[[category.title]]</a>
              </template>
            </dom-repeat>
          </iron-selector>
        </template>
      </dom-if>
    </header>

    <!--
      Sticky nav reveals when scrolled down on the page.
    -->
    <app-box role="banner" class="sticky-nav" threshold="[[_getScrollThreshold(smallScreen)]]">
      <app-toolbar class="sticky-nav-toolbar">
        <paper-icon-button arial-label="Main navigation" icon="[[_menuIcon(drawerOpened)]]" on-click="_toggleDrawer"></paper-icon-button>
        <div class="sticky-nav-center">
          <div class="logo">
            <a href="/" aria-label\$="[[_computeAppHomeLabel(appTitle)]]">[[appTitle]]</a>
          </div>
          <div class="date-line" role="heading">
            [[category.title]] <span aria-hidden="true">&nbsp; · &nbsp;</span> [[_currentTime()]]
          </div>
          <div class="article-headline">
            <slot></slot>
          </div>
        </div>
        <paper-icon-button icon="mail" aria-label="Send by mail"></paper-icon-button>
        <paper-icon-button icon="share" aria-label="Share on social networks"></paper-icon-button>
      </app-toolbar>
      <div class="sticky-nav-menu" shown\$="[[drawerOpened]]">
        <iron-selector class="grid-container" role="navigation" selected="[[category.name]]" attr-for-selected="name">
          <dom-repeat items="[[categories]]" as="category" initial-count="9">
            <template>
              <a name="[[category.name]]" href="/list/[[category.name]]">[[category.title]]</a>
            </template>
          </dom-repeat>
        </iron-selector>
      </div>
    </app-box>
`;
  }

  static get is() { return 'news-header'; }

  static get properties() { return {

    appTitle: String,

    page: {
      type: String,
      reflectToAttribute: true
    },

    categories: Array,

    category: Object,

    smallScreen: Boolean,

    drawerOpened: {
      type: Boolean,
      notify: true
    }

  }}

  _menuIcon(drawerOpened) {
    return drawerOpened ? 'close' : 'menu';
  }

  _currentTime() {
    let monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    let date = new Date();

    return monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  _toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }

  _getScrollThreshold(smallScreen) {
    return smallScreen ? window.innerHeight - 64 : 162;
  }

  _computeAppHomeLabel(appTitle) {
    return appTitle + ' Home';
  }
}

customElements.define(NewsHeader.is, NewsHeader);
