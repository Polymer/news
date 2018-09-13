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

import '@polymer/iron-media-query/iron-media-query.js';
import './news-header.js';

class NewsNav extends PolymerElement {
  static get template() {
    return html`
    <iron-media-query query="max-width: 767px" query-matches="{{_smallScreen}}"></iron-media-query>

    <news-header app-title="[[appTitle]]" page="[[page]]" categories="[[categories]]" category="[[category]]" small-screen="[[_smallScreen]]" drawer-opened="{{_drawerOpened}}">
      <slot></slot>
    </news-header>

    <!--
      Lazy-create the drawer on small viewports.
    -->
    <dom-if if="[[_shouldRenderDrawer(_smallScreen, loadComplete)]]">
      <template>
        <news-drawer categories="[[categories]]" category="[[category]]" drawer-opened="{{_drawerOpened}}">
        </news-drawer>
      </template>
    </dom-if>
`;
  }

  static get is() { return 'news-nav'; }

  static get properties() { return {

    appTitle: String,

    page: String,

    categories: Array,

    category: Object,

    loadComplete: Boolean,

    _smallScreen: Boolean,

    _drawerOpened: Boolean

  }}

  closeDrawer() {
    this._drawerOpened = false;
  }

  _shouldRenderDrawer(smallScreen, loadComplete) {
    return smallScreen && loadComplete;
  }
}

customElements.define(NewsNav.is, NewsNav);
