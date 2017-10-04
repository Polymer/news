import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';

class NewsSideList extends Element {
  static get template() {
    return `
    <style>

      :host {
        display: block;
      }

      h3 {
        @apply --app-sub-section-headline;
      }

      a {
        text-decoration: none;
        color: inherit;
        display: block;
        margin: 20px 0;
      }

      .category {
        display: none;
      }

      .time-ago {
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
      }

      :host([featured]) > a {
        padding-bottom: 24px;
        border-bottom: var(--app-border-style);
      }

      :host([featured]) > a:last-of-type {
        border-bottom: none;
      }

      :host([featured]) .category {
        display: inline-block;
        padding: 6px 20px 7px 20px;
        border: var(--app-border-style);
        font-weight: bold;
        font-size: 11px;
      }

      :host([featured]) .headline {
        display: block;
        margin: 20px 0;
      }

      :host([featured]) .time-ago {
        display: block;
      }

    </style>

    <h3>
      <slot></slot>
    </h3>
    <dom-repeat items="[[items]]">
      <template>
        <a href\$="[[item.href]]">
          <div class="category">[[item.category]]</div>
          <span class="headline">[[item.headline]]</span>
          <span class="time-ago">[[item.timeAgo]]</span>
        </a>
      </template>
    </dom-repeat>
`;
  }

  static get is() { return 'news-side-list'; }

  static get properties() { return {

    items: Array

  }}
}

customElements.define(NewsSideList.is, NewsSideList);
