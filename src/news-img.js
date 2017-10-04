import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import '../node_modules/@polymer/iron-flex-layout/iron-flex-layout.js';

class NewsImg extends Element {
  static get template() {
    return `
    <style>

      :host {
        display: block;
        position: relative;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        background-color: #ddd;
      }

      img {
        @apply --layout-fit;
        margin: 0 auto;
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: opacity 0.1s;
        opacity: 0;
      }

      /* Support object-fit in IE 11 */
      _:-ms-lang(x), img {
        top: -10000px;
        right: -10000px;
        bottom: -10000px;
        left: -10000px;
        margin: auto;
        width: 100%;
        height: auto;
      }

      /* Support object-fit in Edge */
      _:-ms-lang(x), _:-webkit-full-screen, img {
        width: auto;
        zoom: 0.1;
        min-width: 100%;
        min-height: 100%;
      }

    </style>

    <img id="img" alt\$="[[alt]]" on-load="_onImgLoad" on-error="_onImgError">
`;
  }

  static get is() { return 'news-img'; }

  static get properties() { return {

    alt: String,

    src: {
      type: String,
      observer: '_srcChanged'
    },

    placeholderSrc: {
      type: String,
      observer: '_placeholderSrcChanged'
    }

  }}

  _srcChanged(src) {
    this.$.img.removeAttribute('src');
    this.$.img.style.opacity = '';
    if (src) {
      this.$.img.src = src;
    }
  }

  _onImgLoad() {
    this.$.img.style.opacity = '1';
  }

  _onImgError() {
    if (!this.placeholderSrc) {
      this.$.img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#CCC" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>');
    }
  }

  _placeholderSrcChanged(placeholder) {
    this.style.backgroundImage = placeholder ? 'url(\'' + placeholder + '\')' : '';
  }
}

customElements.define(NewsImg.is, NewsImg);
