import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';

class NewsIframe extends Element {
  static get template() {
    return `
    <style>

      :host {
        display: inline-block;
        position: relative;
        overflow: hidden;
      }

      iframe {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }

    </style>
`;
  }

  static get is() { return 'news-iframe'; }

  static get properties() { return {

    src: String,

    _iframeCreated: Boolean

  }}

  static get observers() { return [
    '_srcChanged(src, _iframeCreated)'
  ]}

  connectedCallback() {
    super.connectedCallback();
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver(this._createIframe.bind(this));
      this._io.observe(this);
    } else {
      // Intersection Observer is not available, so just create the iframe
      // after a bit of a delay.
      window.setTimeout(this._createIframe.bind(this), 100);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeIntersectionObserver();
  }

  _removeIntersectionObserver() {
    if (this._io) {
      this._io.disconnect();
      this._io = null;
    }
  }

  _createIframe() {
    this._removeIntersectionObserver();
    if (this._iframe) {
      return;
    }
    this._iframe = document.createElement('iframe');
    this.root.appendChild(this._iframe);
    this._iframeCreated = true;
  }

  _srcChanged(src) {
    if (this._iframe) {
      this._iframe.src = src;
    }
  }
}

customElements.define(NewsIframe.is, NewsIframe);
