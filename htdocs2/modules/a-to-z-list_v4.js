/**
 * a-to-z-list.js, this wrap a standard UL list providing A to Z navigation list
 */
export class AToZList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement("template");
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
      <div id="list-container"></div>
  `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const listContainer = this.shadowRoot.querySelector("#list-container");
    const ulElement = this.querySelector("ul");

    if (!ulElement) return;

    const items = Array.from(ulElement.querySelectorAll("li"));
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const sections = {};

    items.forEach((item) => {
      const firstLetter = item.textContent.trim()[0].toUpperCase();
      if (!sections[firstLetter]) sections[firstLetter] = [];
      sections[firstLetter].push(item);
    });

    Object.keys(sections).forEach((letter) => {
      const section = document.createElement("ul");
      section.classList.add("letter-section");
      section.id = `section-${letter}`;

      sections[letter].forEach((item) => {
        section.appendChild(item.cloneNode(true));
      });

      listContainer.appendChild(section);
    });
  }
}
customElements.define("a-to-z-list", AToZList);
