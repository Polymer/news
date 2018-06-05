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

import { flush } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';

class NewsSnackbar extends PolymerElement {
  static get template() {
    return html`
    <style>

      :host {
        display: block;
        position: fixed;
        left: calc(50% - 160px);
        right: calc(50% - 160px);
        bottom: 0;
        width: 320px;
        background-color: var(--app-nav-background-color);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        color: var(--app-nav-text-color);
        padding: 12px;
        visibility: hidden;
        text-align: center;
        will-change: transform;
        -webkit-transform: translate3d(0, 100%, 0);
        transform: translate3d(0, 100%, 0);
        transition-property: visibility, -webkit-transform;
        transition-property: visibility, transform;
        transition-duration: 0.2s;
      }

      :host(.opened) {
        visibility: visible;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }

      /* mobile */
      @media (max-width: 767px) {
        :host {
          left: 0;
          right: 0;
          width: auto;
        }
      }

    </style>

    <slot></slot>
`;
  }

  static get is() { return 'news-snackbar'; }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'alert');
    this.setAttribute('aria-live', 'assertive');
  }

  open() {
    flush();
    this.removeAttribute('aria-hidden');
    this.offsetHeight && this.classList.add('opened');
    this._closeDebouncer = Debouncer.debounce(this._closeDebouncer,
      timeOut.after(4000), () => {
        this.close();
      });
  }

  close() {
    this.setAttribute('aria-hidden', 'true');
    this.classList.remove('opened');
  }
}

customElements.define(NewsSnackbar.is, NewsSnackbar);
