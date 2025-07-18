export class AToZList extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }

  connectedCallback() { this.render(); }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `<style>
        /* Basic styles */
        menu { list-style-type: none; padding: 0; }
      </style>
      <menu id="menu"></menu>
      <div id="list-container">This is where our A to List will go</div>`;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('a-to-z-list', AToZList);