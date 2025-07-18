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
    template.innerHTML = `
      <style>
        menu { list-style-type: none; padding: 0; }
        menu li { display: inline; margin-right: 10px; }
        .letter-section { list-style-type: none; }
        .letter-section li { text-decoration: none; font-weight: none; }
        .back-to-menu { display: block; margin-top: 20px; }
      </style>
      <menu id="menu"></menu>
      <div id="list-container"></div>
      ${this.hasAttribute('long') ? '<a class="back-to-menu" href="#menu">Back to Menu</a>' : ''}
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const listContainer = this.shadowRoot.querySelector('#list-container');
    const ulElement = this.querySelector('ul');

    if (!ulElement) return;

    const items = Array.from(ulElement.querySelectorAll('li'));
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const sections = {};

    items.forEach(item => {
      const firstLetter = item.textContent.trim()[0].toUpperCase();
      if (!sections[firstLetter]) sections[firstLetter] = [];
      sections[firstLetter].push(item);
    });

    const menu = this.shadowRoot.querySelector('#menu');

    Object.keys(sections).forEach(letter => {
      const menuItem = document.createElement('li');
      const menuLink = document.createElement('a');
      menuLink.href = `#section-${letter}`;
      menuLink.textContent = letter;
      menuItem.appendChild(menuLink);
      menu.appendChild(menuItem);
      
      const section = document.createElement('ul');
      section.classList.add('letter-section');
      section.id = `section-${letter}`;

      sections[letter].forEach(item => {
        section.appendChild(item.cloneNode(true));
      });

      listContainer.appendChild(section);
    });

    const backToMenuLink = this.shadowRoot.querySelector('.back-to-menu');
    if (backToMenuLink) {
      backToMenuLink.addEventListener('click', (event) => {
        event.preventDefault();
        this.scrollToSection(menu);
      });
    }

    // Add event listeners to menu links for smooth scrolling
    const menuLinks = this.shadowRoot.querySelectorAll('menu li a');
    menuLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetSection = this.shadowRoot.querySelector(link.getAttribute('href'));
        this.scrollToSection(targetSection);
      });
    });
  }

  scrollToSection(section) {
    const yOffset = -100;
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}
customElements.define('a-to-z-list', AToZList);
