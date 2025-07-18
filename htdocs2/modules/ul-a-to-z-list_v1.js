/**
 * a-to-z-list.js, this wrap a standard UL list providing A to Z navigation list
 */
export class AToZList extends HTMLElement {
  constructor() {
    super();
    // This next line engages the Shadow DOM
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
  }

}
customElements.define('a-to-z-list', AToZList);
