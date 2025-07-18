---
title: "A recipe for applications: Dataset & Web Components (Part 2)"
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
abstract: |
  A workshop demonstrating Web Components by enhancing our previous
  recipe application prototype.
institute: |
  Caltech Library,
  Digital Library Development
description: workshop presentation
slidy-url: .
css: styles/sea-and-shore.css
createDate: 2025-05-29
updateDate: 2025-07-08
draft: true
pubDate: TBD
place: Caltech Library (Zoom)
date: TBD
section-titles: false
toc: true
keywords: [ "Dataset", "HTML", "CSS", "JavaScript", "Web Components" ]
url: "https://caltechlibrary.github.io/t2t3_dataset_web_app/presentation1.html"
---

# Welcome to "A recipe for applications"

Welcome everyone,

This presentation builds on what we built in the Part 1.

This workshop is focused on enhancing our application using Web Components.

# What we'll learn

- What are Web Components?
- Why use Web Components?
- Anatomy of Web Components
- Using Web Components

# What we'll do

- Save our static content directory 
- Save our [recipes_api.yaml](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/recipes_api2.yaml "you may retrieve this file with curl or irm")
- Create our first web component, "`<hello-clock></hello-clock>`"
- Develop an A to Z web component, "`<ul-a-to-z-list></ul-a-to-z-list>`" (for listing our recipes)
- Use the [`<textarea-csv></textarea-csv>`](https://caltechlibrary.github.io/CL-web-components/textarea-csv.html) from [CL-web-components](https://github.com/caltechlibrary/CL-web-components/releases) for our ingredient lists

# Workshop: "A recipe for applications"

- Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation2.html>
- Download the presentation zip, <https://github.com/caltechlibrary/t2t3_dataset_web_apps/releases>
- Make suggestions for improving the workshop at <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>

# Getting started, Part II

### You'll need the following from Part I

- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/)
- [Dataset >= 2.3.2](https://caltechlibrary.github.io/dataset/INSTALL.html) (or latest release)
- cURL or irm
- The YAML, HTML and JavaScript you developed from Part I

# Part 2.1: Setting up

## Next steps

- Save the old the `htdocs` directory under `htdocs1`
- Save the old `recipes_api.yaml` as `recipes_api1.yaml`

# Part 2.1: Copying htdocs and recipes_api.yaml

On macOS, Linux and Windows using WSL

~~~shell
cp -fR htdocs htdocs1
cp recipes_api.yaml recipes_api1.yaml
~~~

On Windows in PowerShell

~~~pwsh
copy -Recurse htdocs htdocs1
copy recipes_api.yaml recipes_api1.yaml
~~~

HOME WORK: Make `recipes_api1.yaml` work. Change the
the `htdocs` attribute to point to `htdocs1` directory.
Compare version 1 with the results of the workshop.
Discuss among friends.

# Part 2.1: Starting up our web service

- The web service works just like our session
- We'll be building browser side, updating the htdocs directory
  - Ready to dive into Web Components?

~~~shell
datasetd recipes_api.yaml
~~~

# Part 2.2: The "What" of Web Components

- Web Components are a W3C standard to allowing you to extend HTML
  - (Web Components inherit, including accessibility features)
- A Web Component encapsulates the HTML, CSS and JavaScript use to create a new HTML Element
  - (They encourage sensible code re-use)
- Web Components are re-usable blocks of structure, function and presentation

# Part 2.2: The "Why" of Web Components

- Web components provide a sustainable way to extend HTML to fit our needs
- They simplify use because they are expressed as HTML elements
- Web components **cleanly encapsulate** HTML, CSS and JavaScript
  - Their impact is constrained
  - They are compatible with progressive enhancement techniques
  - They can normalize user experience as a part of a design system

# Part 2.2: The Anatomy of a Web Component

- A component is implemented as a JavaScript class
  - The class extends an existing HTML element (inheriting its features)
- The class contains a `connectedCallback()` method
- The component is "registered" using the `customElements.define()` method
  - Example: `customElements.define( 'hello-clock', HelloClock );`

# Part 2.2: Why extend HTML elements?

1. So we don't have to define everything in JavaScript
  - DOM, life cycle, events, etc.
2. So we align with existing HTML element expectations

# Part 2.2: What's the `connectedCallback()` method?

- This provides a "hook" into the browser's render engine and event handler

# Part 2.2.: What's registration?

- Registration tells the web browser this is a new HTML element type
  - Web browsers ignores HTML elements they don't understand
- Registration configures the new element's relationship with HTML parser and render engine

# Part 2.2: The "Hello Clock" Web Component

- Let's create a web component called "hello-clock" ("htdocs/modules/hello-clock.js")
- "hello-clock" will extends "HTML element"
- It will display a hello message and the time

~~~html
<hello-clock>Hi There!</hello-clock>
~~~

This will display something like, "Hi There! 09:27:23 GMT-0700 (Pacific Daylight Time)".

# Part 2.2: "hello-clock.js" defines the web component

Create [htdocs/modules/hello-clock.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/hello-clock.js "you may retrieve this file using curl or irm")

~~~JavaScript
// Define our new element as a class
class HelloClock extends HTMLElement {
  // Hook used by browser to instantiate the element in the page
  connectedCallback() {
    // Get the current time as an object
    const d = new Date();
    // Update the inner text to include our time string
    this.textContent = `${this.textContent} ${d.toTimeString()}`.trim();
  }
}
// This is how the browsers learns to use the new HTML element.
customElements.define( 'hello-clock', HelloClock );
~~~

# Part 2.2: Now lets create an HTML Page using "Hello Clock"

- [htdocs/hello-clock.html](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/hello-clock.html "you may retrieve this file using curl or irm")

~~~html
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <title>Hello Clock Example</title>
        <link rel="style" href="css/style.css">
        <script type="module" src="modules/hello-clock.js" defer></script>
    </head>
    <body>
        <h1>Hello Clock Example</h1>
        <hello-clock>Hi there!</hello-clock>
    </body>
</html>
~~~

# Part 2.2: Fire up our web service and test "Hello Clock"

1. Point your web browser at <http://localhost:8001/hello-clock.html>
2. Open your developer tools and reload the page
3. Notice the logs provided by Dataset Web Service

# Part 2.2: Congratulations

## You've built your first Web Component!!!!

Let's take a quick break and stretch before moving forward

# Part 2.3: Building an A to Z list web component

Q: What does the A to Z list web component do?

A: Wraps a standard UL list providing A to Z navigation.

# Part 2.3: Building an A to Z list web component

1. Create an HTML file for testing, `htdocs/ul-a-to-z-list.html`
2. Create our Web Component, `htdocs/modules/ul-a-to-z-list.js`

macOS and Linux:

~~~shell
touch htdocs/ul-a-to-z-list.html htdocs/modules/ul-a-to-z-list.js
~~~

Windows:

~~~pwsh
New-Item -Path htdocs/ul-a-to-z-list.html ; New-Item htdocs/modules/ul-a-to-z-list.js
~~~

# Part 2.3: Building an A to Z list web component

Here's the HTML we'll use for our test page, [ul-a-to-z-list.html](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/ul-a-to-z-list.html "you may retrieve this file using curl or irm").

~~~html
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <title>A to Z List Clock Example</title>
        <link rel="style" href="css/style.css">
        <script type="module" src="modules/ul-a-to-z-list.js" defer></script>
    </head>
    <body>
        <h1>A to Z List Example</h1>

        <ul-a-to-z-list>
            <ul>
                <li>Alex</li> <li>Betty</li> <li>Connor</li> <li>David</li>
                <li>Edwina</li> <li>Fiona</li> <li>George</li> <li>Harry</li>
                <li>Ishmael</li> <li>Leonardo</li> <li>Millie</li> <li>Nellie</li>
                <li>Ollie</li> <li>Petra</li> <li>Quincy</li> <li>Rowino</li> <li>Selvina</li>
                <li>Terry</li> <li>Ulma</li> <li>Victorio</li> <li>Willamina</li> <li>Xavier</li>
                <li>Zoran</li>
            </ul>
        </ul-a-to-z-list>
    </body>
</html>
~~~

# Part 2.3: Building an A to Z list web component

(source [ul-a-to-z-list_v0.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v0.js "you may retrieve this file using curl or irm"))

Start out with a minimal Class definition and customElement definition

~~~JavaScript
export class AToZList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
  }
}
customElements.define('ul-a-to-z-list', AToZList);
~~~

NOTE: The constructor and callback are empty. Open the web page. Use "the inspector" in your browser's dev tools.

# Part 2.3: Introducing Shadow DOM

(source [ul-a-to-z-list_v1.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v1.js "you may retrieve this file using curl or irm"))

You can build your web component using the Shadow DOM. We need to include that in our constructor.

~~~JavaScript
export class AToZList extends HTMLElement {
  constructor() {
    super();
    // This next line engages the Shadow DOM
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
  }
}
customElements.define('ul-a-to-z-list', AToZList);
~~~

Reload you web page, what does does it look like? What shows up in the inspector?

# Part 2.3: What do we want the callback to do? 

We use the `connectedCallback()` method to to call a render method. This is what makes our shadow DOM element visible.

~~~JavaScript
export class AToZList extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }

  connectedCallback() { this.render(); }

  render() {
    const template = document.createElement('template');
    template.innerHTML = '<!-- Our HTML markup will go here ... -->';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('ul-a-to-z-list', AToZList);
~~~

What happened in our web page? What does the inspector show?

# Part 2.3: Basic Structure

(source [ul-a-to-z-list_v2.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v2.js "you may retrieve this file using curl or irm"))

~~~JavaScript
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
      <div id="list-container"></div>`;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('ul-a-to-z-list', AToZList);
~~~

# Part 2.3: Display Items

(source [ul-a-to-z-list_v3.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v3.js "you may retrieve this file using curl or irm"))

~~~JavaScript
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
~~~

What happened in our web page? What shows up in the inspector?

# Part 2.3: Organize Items by Starting Letter

(source [ul-a-to-z-list_v4.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v4.js "you may retrieve this file using curl or irm"))

~~~JavaScript
render() {
  const template = document.createElement('template');
  template.innerHTML = `<style>
      /* Basic styles */
      menu { list-style-type: none; padding: 0; }
      .letter-section { list-style-type: none; }
    </style>
    <menu id="menu"></menu>
    <div id="list-container"></div>`;

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
  Object.keys(sections).forEach(letter => {
    // NOTE: Menu setup will go here
    const section = document.createElement('ul');
    section.classList.add('letter-section');
    section.id = `section-${letter}`;

    sections[letter].forEach(item => {
      section.appendChild(item.cloneNode(true));
    });

    listContainer.appendChild(section);
  });
}
~~~

# Part 2.3: Add Navigation Menu

(source [ul-a-to-z-list_v5.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v5.js "you may retrieve this file using curl or irm"))

~~~JavaScript
render() {
  // Previous code remains the same until the sections loop but we
  // need to grab the menu element in the template.
  const menu = this.shadowRoot.querySelector('#menu');

  Object.keys(sections).forEach(letter => {
    const menuItem = document.createElement('li');
    const menuLink = document.createElement('a');
    menuLink.href = `#section-${letter}`;
    menuLink.textContent = letter;
    menuItem.appendChild(menuLink);
    menu.appendChild(menuItem);

    // Rest of the section linking code goes here
  });
}
~~~

# Part 2.3: Linking

(source [ul-a-to-z-list_v6.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v6.js "you may retrieve this file using curl or irm"))

~~~JavaScript
  // Section linking inside the `Object.keys(sections).forEach(letter => {` loop
  const section = document.createElement('ul');
      section.classList.add('letter-section');
      section.id = `section-${letter}`;

      sections[letter].forEach(item => {
        section.appendChild(item.cloneNode(true));
      });

      listContainer.appendChild(section);
  });
~~~

# Part 2.3: Back to Menu Link

(source [ul-a-to-z-list_v6.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v6.js "you may retrieve this file using curl or irm"))

~~~JavaScript
render() {
  // This code goes below the `Object.keys(section).foreach( ...` loop

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
~~~

# Part 2.3: Improve Scrolling

(source [ul-a-to-z-list_v6.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v6.js "you may retrieve this file using curl or irm"))

~~~JavaScript
// This is a new method, it can go after the render method in our class
scrollToSection(section) {
  const yOffset = -100;
  const y = section.getBoundingClientRect().top +
              window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
}
~~~

# Part 2.3: Style and CSS

(source [ul-a-to-z-list_v7.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v7.js "you may retrieve this file using curl or irm"))

~~~JavaScript
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
${this.hasAttribute('long') ? 
  '<a class="back-to-menu" href="#menu">Back to Menu</a>' : ''
}`;

  // Rest of the render method remains the same
}
~~~

# Part 2.3: A final working A to Z list

(source [ul-a-to-z-list.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list.js "you may retrieve this file using curl or irm"))

~~~JavaScript
/**
 * ul-a-to-z-list.js, this wraps a standard UL list providing A to Z navigation list
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
        .letter-section li { text-decoration: none; font-weight: normal; }
        .back-to-menu { display: block; margin-top: 20px; }
      </style>
      <menu id="menu"></menu>
      <div id="list-container"></div>
      ${this.hasAttribute('long') ? '<a class="back-to-menu" href="#menu">Back to Menu</a>' : ''}
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const listContainer = this.shadowRoot.querySelector('#list-container');
    const menu = this.shadowRoot.querySelector('#menu');

    const ulElement = this.querySelector('ul');
    if (!ulElement) return;

    const items = Array.from(ulElement.querySelectorAll('li'));
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const sections = {};

    items.forEach(item => {
      const firstLetter = item.textContent.trim()[0].toUpperCase();
      if (!sections[firstLetter]) {
        sections[firstLetter] = [];
      }
      sections[firstLetter].push(item);
    });

    alphabet.split('').forEach(letter => {
      if (sections[letter]) {
        const menuItem = document.createElement('li');
        const menuLink = document.createElement('a');
        menuLink.href = `#section-${letter}`;
        menuLink.textContent = letter;
        menuLink.addEventListener('click', (event) => {
          event.preventDefault();
          const targetSection = this.shadowRoot.querySelector(`#section-${letter}`);
          this.scrollToSection(targetSection);
        });
        menuItem.appendChild(menuLink);
        menu.appendChild(menuItem);

        const section = document.createElement('ul');
        section.classList.add('letter-section');
        section.id = `section-${letter}`;
        const sectionHeading = document.createElement('li');
        const sectionHeadingLink = document.createElement('a');
        sectionHeadingLink.href = `#menu`;
        sectionHeadingLink.textContent = letter;
        sectionHeadingLink.addEventListener('click', (event) => {
          event.preventDefault();
          this.scrollToSection(menu);
        });
        sectionHeading.appendChild(sectionHeadingLink);
        section.appendChild(sectionHeading);

        sections[letter].forEach(item => {
          const clonedItem = item.cloneNode(true);
          section.appendChild(clonedItem);
        });
        listContainer.appendChild(section);
      }
    });

    const backToMenuLink = this.shadowRoot.querySelector('.back-to-menu');
    if (backToMenuLink) {
      backToMenuLink.addEventListener('click', (event) => {
        event.preventDefault();
        this.scrollToSection(menu);
      });
    }
  }

  scrollToSection(section) {
    const yOffset = -100;
    const y = section.getBoundingClientRect().top + 
                      window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}

customElements.define('ul-a-to-z-list', AToZList);
~~~

# Part 2.3: Congratulations! You've created two web components!

- `<hello-clock>` (minimal)
- `<ul-a-to-z-list>` (complex)

Let's take a quick break and stretch before moving forward

# Part 2.4: Using our A to Z list

1. Modify is `htdocs/index.html`
2. Wrap the `ul` list with our `<ul-a-to-z-list></ul-a-to-z-list>`
3. Add our component module `<script type="model" src="modules/ul-a-to-z-list.js" defer></script>`
4. Test, what happens on page reload?

# Part 2.4: **Integrating** the A to Z list

- The web component internals are opaque to the outside elements
- our `index_recipes.js` functions don't see the internal UL list now
- What do we do?

# Part 2.4, Approaches

- Pre-render the UL list (add middleware)
- Merge the index_recipes into the web component module
- Modify the web component, Modify index_recipes so they play nice

# Part 2.4, Which approach?

- Context, re-use and complexity are our constraints
  - Is this problem a "common case"? Is there an easy solution?
  - Is an increase in complexity worth supporting the common case?
  - Do we drop the common case for unique element and build in a index_recipes function?

**Before picking a path review our existing codebase against our constraints**

# Part 2.4: Think about the innerHTML, look at `index_recipes.js`

`listRecipes()`
: Gets the outer element, retrieves data and then invokes `populateUL()`

`populateUL()`
: Populates the UL lists with the data

**Are either easy to adapt to our component?**

# Part 2.4: Review `listRecipes()`

- It could get the handle for the `<ul-a-to-z-list></ul-a-to-z-list>`
- `listRecipes()` triggers retrieving the data
- It invokes `populateUL()` which populates that innerHTML!

**We can keep our component general with by adapting how `listRecipes()` works**

# Part 2.4: Taking advantage of inheriting HTML element

(source [index_recipes_v2.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v2.js "you may retrieve this file with curl or irm"))

~~~JavaScript
async function listRecipes() {
 const aToZList = document.querySelector('ul-a-to-z-list');
 console.log(aToZList);
 const ul = document.createElement('ul');
 const data = await getRecipes();
 populateUL(ul, data);
 aToZList.innerHTML = ul.outerHTML;
 // NOTE: we need to trigger aToZList render method still.
 // Feel ugly?
 aToZList.render()
}
~~~

What does the updates look like?

# Part 2.4: Problems?

- Is ordering is weird? Why?
- Do we always have to called `aToZList.render()` to update?

# Part 2.4: Ordering problem

- Get rid of dummy text "Recipe name goes here"

# Part 2.4: Adding an event handler to our component

- Which event is triggered with the line `aToZList.innerHTML = ul.outerHTML`?

1. Update our component to use a mutation observer
2. Remove our render call from `index_recipes.js`.

(source [ul-a-to-z-list_v8.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/ul-a-to-z-list_v8.js "you may retrieve this file with curl or irm"))
(source [index_recipes_v3.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/index_recipes_v3.js "you may retrieve this file with curl or irm"))

# Part 2.4: Lessons learned

- Remember that our web components, inherit from HTML, we can treat them like HTML elements
- Display elements can mutate, we should support mutation even when implementing display only components
  - The JavaScript defining a web component extends HTML, that should be the focus
  - The page level JavaScript is about adding behaviors at the page level
  - Balance the areas of responsibilities
  - A style element in a component can function like a style element in the page head element
    - CSS can be imported

# Part 2.4: Things to remember

- HTML5 provides allot of capability, not everything needs to be a component
- Components let us encapsulate structure, behavior of visual style
- Components work best when they enhance the symantic structure of HTML and the page

# Part 2.5: CL-Web-Components

<https://github.com/caltechlibrary/CL-Web-Components>

- A small collection of ready to go web components
- You can use them individually or collectively

# Part 2.5: Textarea CSV

- What does `<textarea-csv></csv-textara>` do?
  - Typing in comma separated values is cumbersome, can me improve that?
  - The web component presents a table view based on the CSV content in the wrapped textarea
  - If the web browser has JavaScript disabled the textarea still works for typing in comma delimited data

# Part 2.5: How to using Textarea CSV

See <https://caltechlibrary.github.io/CL-Web-compenents/textarea-csv.html>

# Part 2.5: Using Textarea CSV in our web form

Next steps

1. Retrieve [textarea-csv.js](https://raw.githubusercontent.com/caltechlibrary/CL-web-components/refs/heads/main/textarea-csv.js "you may retrieve this file with curl or irm")
2. Copy the component into your modules directory
3. Update your HTML markup
4. Update `utils.js` by adding a `saveRecipe` function
5. Test

# Part 2.5: Retrieving textarea-csv.js

On macOS or Linux.

~~~shell
curl -L -o htdocs/modules/textarea-csv.js \
  https://raw.githubusercontent.com/caltechlibrary/CL-web-components/refs/heads/main/textarea-csv.js 
~~~

On Windows

~~~pwsh
irm `
  https://raw.githubusercontent.com/caltechlibrary/CL-web-components/refs/heads/main/textarea-csv.js `
  -Outfile ./htdocs/modules/textarea-csv.js
~~~

# Part 2.5: Move into our modules directory

On macOS or Linux.

~~~shell
mv textarea-csv.js htdocs/modules
~~~

On Windows

~~~pwsh
move textarea-csv.js htdocs/modules
~~~

# Part 2.5: Update your HTML markup

Wrap our ingredients `textarea`  in a `textarea-csv`.

~~~html
  <textarea-csv id="ingredients" name="ingredients"          
    title="ingredient,units (CSV data)" placeholder="flour,2 cups"
    cols="60"rows="10" 
    column-headings="Ingredients,Units" debug="true">
    <textarea id="ingredients" name="ingredients"
      title="ingredient,units (CSV data)" placeholder="flour,2 cups"
      cols="60"rows="10">
    </textarea>
  </textarea-csv>
~~~

# Part 2.5: Textarea CSV and Web Forms

What happens when I press "save" button in the web form?

- Does the submit process need change? 
- What are the options?
  - submit as a URL encoded document?
  - submit as JSON encoded document?

# Part 2.5: Textarea CSV and Web Forms

We're missing the script element that imports our component.

Include this in the head element of the page.

~~~html
<script type="module" src="modules/textarea-csv.js" defer></script>
~~~

Try submitting the form again. What happens?

# Part 2.5: Fixing web form submission

- We need an event listener to trigger it
  - Which element?
  - What event?

# Part 2.5: Fixing web form submission

The [utils.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/utils.js "you may retrieve this file using curl or irm") needs a`saveRecipe` function.

macOS and Linux

~~~shell
curl -L -o htdocs/modules/utils.js \
  https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/utils.js
~~~

Windows

~~~pwsh
irm `
  https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/utils.js `
  -Output htdocs/modules/utils.js
~~~

# Part 2.5: Fixing web form submission

Add the following at the page before the to process the submission.

~~~HTML
<script type="module" defer>
  import { saveRecipe } from './modules/utils.js';
  const form = document.addEventListener('submit', saveRecipe);
</script>
~~~

# Part 2.5: Test updates

- What issues do you find?
- How could we improve this?

# Part 3: Exploring further, browser side

- The traditional division of responsibilities in the browser is
  - HTML for structured data markup
  - CSS for visual design and layout
  - JavaScript to orchestrate behaviors

Do web components contradict the division of responsibilities?

Is it OK to require JavaScript in a web page?

Is progressive enhancement still relevant in 2025?

# Part 3: Exploring further, server side

- Our application pushed processing browser side
  - When is this a good idea?
  - When is this an bad idea?
- Could our web app be used to render a static public site?
  - How would that be done?
- What if the web service needs to be public facing?

# Part 3: What I've learned

- Build with the grain of the web
  - Building blocks are HTML, CSS, JavaScript, Web Components and HTTP protocol
- Take advantage of localhost
- Target production by building in layers
  - access control: front end web service (Apache+Shibboleth, NginX+Shibboleth)
  - data validation: middle ware (localhost: Go, TypeScript or Python)
  - object storage: Dataset (localhost)

# Reference: Dataset

- [Dataset Project](https://caltechlibrary.github.io/dataset)
- [Dataset Repository](https://github.com/caltechlibrary/dataset)
- [Getting help with Dataset](https://github.com/caltechlibrary/dataset/issues)

# Reference: CL-web-components

[textarea-csv](https://github.com/caltechlibrary/CL-web-components/blob/main/textarea-csv.js)
: Wraps a textarea element and presents a editable table of cells

[ul-a-to-z-list](https://github.com/caltechlibrary/CL-web-components/blob/main/ul-a-to-z-list.js)
: Wraps a UL list and creates an A to Z list

[sortable-table](https://github.com/caltechlibrary/CL-web-components/blob/main/sortable-table.js)
: Wraps an HTML table making it sort-able and filterable on a column

- Getting help with CL-web-components, <https://github.com/caltechlibrary/CL-web-components/issues>.

# Reference: Web Components

- [MDN Examples on GitHub](https://github.com/mdn/web-components-examples)
- [Examples of Accessible Components](https://github.com/scottaohara/accessible_components)
- [Awesome Standalone](https://github.com/davatron5000/awesome-standalones)
- [W3C Design System](https://design-system.w3.org/)

# Reference: Programming Languages

- [HTML5](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content), structured content
- [CSS](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics), layout and style
- [JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting), behaviors and web components
- [SQL and SQLite](https://sqlite.org)
  - [SQLite Tutorial](https://www.sqlitetutorial.net/)
  - Or typing into your favorite LLM, but be prepared to validate the recommendations
- [MDN](https://developer.mozilla.org/en-US)

# Reference: Data formats

- [JSON](https://www.json.org)
- [JSON Lines](https://jsonlines.org)
- [YAML](https://yaml.org/)

# Thank you for listening

- View presentations: 
  - <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>
  - <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation2.html>
- View the repository: <https://github.com/caltechlibrary/t2t3_dataset_web_apps>
- Comment on this presentation: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>
- Author: R. S. Doiel, <mailto:rsdoiel@caltech.edu>

