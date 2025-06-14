/**
 * a-to-z-list.js, this wrap a standard UL list providing A to Z navigation list
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
    template.innerHTML = `
      <style>
        menu {
          list-style-type: none;
          padding: 0;
        }
        menu li {
          display: inline;
          margin-right: 10px;
        }
        .letter-section {
          list-style-type: none;
        }
        .letter-section li {
          text-decoration: none;
          font-weight: none;         
        }
        .back-to-menu {
          display: block;
          margin-top: 20px;
        }
      </style>
      <menu id="menu"></menu>
      <div id="list-container">This is where our A to List will go</div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('a-to-z-list', AToZList);
