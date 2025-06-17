/**
 * a-to-z-list.js, this wraps a standard UL list providing A to Z navigation list
 */
export class AToZList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `<style>
        /* Basic styles */
        menu { list-style-type: none; padding: 0; }
      </style>
      <menu id="menu"></menu>
      <div id="list-container"></div>`;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const listContainer = this.shadowRoot.querySelector('#list-container');
    const ulElement = this.querySelector('ul');

    if (ulElement) {
      listContainer.appendChild(ulElement.cloneNode(true));
    }
  }
}
customElements.define('a-to-z-list', AToZList);
