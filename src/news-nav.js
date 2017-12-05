import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import '../node_modules/@polymer/iron-media-query/iron-media-query.js';
import './news-header.js';

import { store } from './store/store.js';
import { drawerOpened, drawerClosed } from './store/actions/app.js';

class NewsNav extends Element {
  static get template() {
    return `
    <iron-media-query query="max-width: 767px" query-matches="{{_smallScreen}}"></iron-media-query>

    <news-header app-title="[[appTitle]]" page="[[page]]" categories="[[_categoryList]]" category="[[category]]" small-screen="[[_smallScreen]]" drawer-opened="[[_drawerOpened]]">
      <slot></slot>
    </news-header>

    <!--
      Lazy-create the drawer on small viewports.
    -->
    <dom-if if="[[_shouldRenderDrawer(_smallScreen, loadComplete)]]">
      <template>
        <news-drawer categories="[[_categoryList]]" category="[[category]]" drawer-opened="[[_drawerOpened]]">
        </news-drawer>
      </template>
    </dom-if>
`;
  }

  static get is() { return 'news-nav'; }

  static get properties() { return {

    appTitle: String,
    page: String,
    category: Object,
    loadComplete: Boolean,
    _smallScreen: Boolean,

    // From the redux state.
    _drawerOpened: Boolean,
    _categoryList: Array
  }}

  constructor() {
    super();
    store.subscribe(() => this.update());
    this.update();
  }

  update() {
    const state = store.getState();
    this.setProperties({
      _drawerOpened: state.app.drawerOpened,
      _categoryList: Object.values(state.data)
    });
  }

  ready() {
    super.ready();
    this.addEventListener('drawer-opened', function(e) {
      // We only care if there's a change.
      if (this._drawerOpened === e.detail.opened) {
        return;
      }
      if (e.detail.opened) {
        store.dispatch(drawerOpened());
      } else {
        store.dispatch(drawerClosed());
      }
    })
  }

  closeDrawer() {
    this.dispatchEvent(new CustomEvent('drawer-opened',
        {bubbles: true, composed: true, detail: {opened: false}}));
  }

  _shouldRenderDrawer(smallScreen, loadComplete) {
    return smallScreen && loadComplete;
  }
}

customElements.define(NewsNav.is, NewsNav);
