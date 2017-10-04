import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import '../node_modules/@polymer/iron-icon/iron-icon.js';

class NewsPathWarning extends Element {
  static get template() {
    return `
    <style>
      :host {
        display: block;
        text-align: center;
        padding: 120px 20px;
        color: var(--app-secondary-color);
      }
      iron-icon {
        display: inline-block;
        width: 60px;
        height: 60px;
      }
      h1 {
        margin: 50px 0 50px 0;
        font-weight: 300;
      }
      a {
        font-weight: bold;
        color: black;
        text-decoration: none;
      }

      /* mobile */
      @media (max-width: 767px) {
        :host {
          box-sizing: border-box;
          height: 100vh;
          background: var(--app-nav-background-color);
          color: var(--app-nav-text-color);
        }

        a {
          color: var(--app-nav-text-color);
        }
      }
    </style>

    <div>
      <iron-icon icon="error"></iron-icon>
      <h1>Sorry, we couldn't find that page.</h1>
    </div>

    <a href="/">Go to the home page</a>
    `;
  }
  static get is() { return 'news-path-warning'; }

}

customElements.define(NewsPathWarning.is, NewsPathWarning);
