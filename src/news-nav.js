import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import '../node_modules/@polymer/iron-media-query/iron-media-query.js';
import './news-header.js';

import { store } from './redux/store.js';
import { drawerOpened, drawerClosed } from './redux/actions/app.js';

class NewsNav extends Element {
  static get template() {
    return `
    <iron-media-query query="max-width: 767px" query-matches="{{_smallScreen}}"></iron-media-query>

    <news-header app-title="[[appTitle]]" page="[[page]]" categories="[[categories]]" category="[[category]]" small-screen="[[_smallScreen]]" drawer-opened="[[_drawerOpened]]">
      <slot></slot>
    </news-header>

    <!--
      Lazy-create the drawer on small viewports.
    -->
    <dom-if if="[[_shouldRenderDrawer(_smallScreen, loadComplete)]]">
      <template>
        <news-drawer categories="[[categories]]" category="[[category]]" drawer-opened="[[_drawerOpened]]">
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

  constructor() {
    super();
    store.subscribe(() => this.update());
    this.update();
  }

  update() {
    const state = store.getState();
    this.setProperties({
      _drawerOpened: state.app.drawerOpened
    });
  }

  ready() {
    super.ready();
    this.addEventListener('drawer-opened', function(e) {
      if (e.detail.opened) {
        store.dispatch(drawerOpened());
      } else {
        store.dispatch(drawerClosed());
      }
    })
  }

  closeDrawer() {
    this.dispatchEvent(new CustomEvent('drawer-opened',
        {bubbles: true, composed: true}, {opened: false}));
  }

  _shouldRenderDrawer(smallScreen, loadComplete) {
    return smallScreen && loadComplete;
  }
}

customElements.define(NewsNav.is, NewsNav);
