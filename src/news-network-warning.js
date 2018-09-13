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

import '@polymer/iron-icon/iron-icon.js';
import './news-icons.js';

class NewsNetworkWarning extends PolymerElement {
  static get template() {
    return html`
    <style>

      :host {
        display: block;
        padding: 120px 20px;
        text-align: center;
      }

      [hidden] {
        display: none !important;
      }

      iron-icon {
        display: inline-block;
        width: 30px;
        height: 30px;
      }

      h1 {
        font-weight: 300;
      }

      button {
        background: transparent;
        border: var(--app-button-border-style);
        padding: 10px 20px;
        font-weight: 600;
        color: inherit;
      }

      /* mobile */
      @media (max-width: 767px) {
        :host {
          box-sizing: border-box;
          height: 100vh;
          background: var(--app-nav-background-color);
          color: var(--app-nav-text-color);
        }

        button {
          border: 2px solid var(--app-nav-text-color);
          color: var(--app-nav-text-color);
        }
      }

    </style>

    <iron-icon icon="cloud-off"></iron-icon>
    <div hidden\$="[[offline]]">
      <h1>Couldn't reach the server</h1>
    </div>
    <div hidden\$="[[!offline]]">
      <h1>No internet connection</h1>
      <p>Check if your device is connected to a mobile network or WiFi.</p>
    </div>

    <button on-click="_tryReconnect">Try Again</button>
`;
  }

  static get is() { return 'news-network-warning'; }

  static get properties() { return {

    offline: Boolean

  }}

  _tryReconnect() {
    this.dispatchEvent(new CustomEvent('try-reconnect', {composed: true}));
  }
}

customElements.define(NewsNetworkWarning.is, NewsNetworkWarning);
