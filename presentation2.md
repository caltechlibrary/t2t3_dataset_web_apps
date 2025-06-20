---
title: "A recipe for applications: Dataset & Web Components (Part 2)"
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
abstract: |
  A workshop demonstrating Web Components by enhancing our previous
  recipe application prototype.
institute: |
  Caltech Library,
  Digital Library Development
description: T2T3 presentation
urlcolor: blue
linkstyle: bold
aspectratio: 169
createDate: 2025-05-29
updateDate: 2025-06-20
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

- Setup up a new static content directory for update our [recipes_api.yaml](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/recipes_api2.yaml)
- Create our first web component, "`<hello-clock></hello-clock>`"
- Develop an A to Z web component, "`<a-to-z-list></a-to-z-list>`"
- Use the [`<csv-textarea></csv-textarea>`](https://caltechlibrary.github.io/CL-web-components/CSVTextarea.html) from [CL-web-components](https://github.com/caltechlibrary/CL-web-components/releases) for our ingredient lists

# Workshop: "A recipe for applications"

- Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation2.html>
- Download the presentation zip, <https://github.com/caltechlibrary/t2t3_dataset_web_apps/releases>
- Make suggestions for improving the workshop at <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>

# Getting started, Part II

### You'll need the following from Part I

- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/)
- [Dataset >= 2.2.7](https://caltechlibrary.github.io/dataset/INSTALL.html) (or latest release)
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

NOTE: If you want to compare version you'll need to update 
the `htdocs` attribute in `recipes_api1.yaml`.

# Part 2.1: Starting up our web service

- We're have a working web service from last session. 
- We're building on that browser side
- Time to dive into Web Components!

~~~shell
datasetd recipes_api.yaml
~~~

# Part 2.2: The "What" of Web Components

- Web Components are a W3C standard to allowing you to extend HTML
  - (Web Components inherit, include accessibility features)
- A Web Component encapsulates the HTML, CSS and JavaScript use to create a new HTML Element
  - (They encourage sensible code re-use)
- Web Components are re-usable blocks of structure, function and presentation

# Part 2.2: The "Why" of Web Components

- Web components provide a sustainable way to extend HTML to fit our needs
- They simplify use because they are expressed as HTML elements
- Web components **cleanly encapsulate** HTML, CSS and JavaScript
  - They are impact is constrained to the elements inside!
  - They are compatible with progressive enhancement techniques
  - They can normalize user experience as a part of a design system

# Part 2.2: The Anatomy of a Web Component

- A component is implemented as a JavaScript class
  - The class extends an existing HTML element (inheriting its features)
- The class contains a `connectedCallback()` method
- The component is "registered" using the `customElements.define()` method
  - Example: `customElements.define( 'hello-clock', HelloClock );`

# Part 2.2: The "Hello Clock" Web Component

- Let's create a web component called "hello-clock" ("htdocs/modules/hello-clock.js")
- "hello-clock" will extended the HTML element
- It will display a hello message and the time

~~~html
<hello-clock>Hi There!</hello-clock>
~~~

This will display something like, "Hi There! 09:27:23 GMT-0700 (Pacific Daylight Time)".

# Part 2.2: "hello-clock.js" defines the web component

Create [htdocs/modules/hello-clock.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/modules/hello-clock.js)

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

- [htdocs/hello-clock.html](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/hello-clock.html)

~~~html
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <title>Hello Clock Example</title>
        <link rel="style" href="css/style.css">
        <script type="module" src="modules/hello-clock.js"></script>
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

1. Create an HTML to test with, `htdocs/a-to-z-list.html`
2. Create our Web Component, `htdocs/modules/a-to-z-list.js`

macOS and Linux:

~~~shell
touch htdocs/a-to-z-list.html htdocs/modules/a-to-z-list.js
~~~

Windows:

~~~pwsh
New-Item -Path htdocs/a-to-z-list.html ; New-Item htdocs/modules/a-to-z-list.js
~~~

# Part 2.3: Building an A to Z list web component

Here's the HTML we'll use for our test page, `a-to-z-list.html`.

~~~html
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <title>A to Z List Clock Example</title>
        <link rel="style" href="css/style.css">
        <script type="module" src="modules/a-to-z-list.js"></script>
    </head>
    <body>
        <h1>A to Z List Example</h1>

        <a-to-z-list>
            <ul>
                <li>Alex</li> <li>Betty</li> <li>Connor</li> <li>David</li>
                <li>Edwina</li> <li>Fiona</li> <li>George</li> <li>Harry</li>
                <li>Ishmael</li> <li>Leonardo</li> <li>Millie</li> <li>Nellie</li>
                <li>Ollie</li> <li>Petra</li> <li>Quincy</li> <li>Rowino</li> <li>Selvina</li>
                <li>Terry</li> <li>Ulma</li> <li>Victorio</li> <li>Willamina</li> <li>Xavier</li>
                <li>Zoran</li>
            </ul>
        </a-to-z-list>
    </body>
</html>
~~~

# Part 2.3: Building an A to Z list web component

(source [a-to-z-list_v0.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v0.js))

Start out with a minimal Class definition and customElement definition

~~~JavaScript
export class AToZList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
  }
}
customElements.define('a-to-z-list', AToZList);
~~~

NOTE: the constructor and that the web component does do any thing yet. Open the web page.

# Part 2.3: Introducing Shadow DOM

(source [a-to-z-list_v1.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v1.js))

You can build your web component in the Shadow DOM that way you can sprinkle it into your document as needed. We need to include that in our constructor.

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
customElements.define('a-to-z-list', AToZList);
~~~

Reload you web page, what does does it look like?

# Part 2.3: What do we want the callback to do? 

(source [a-to-z-list_v2.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v2.js))

We use the `connectedCallback()` method to to call a render method. This is what makes our Shadow DOM ready.

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
      <div id="list-container">This is where our A to List will go</div>`;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('a-to-z-list', AToZList);
~~~

What happened in our web page?

# Part 2.3: Basic Structure of our component using Shadow DOM

(source [a-to-z-list_v2.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v2.js))

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
customElements.define('a-to-z-list', AToZList);
~~~

# Part 2.3: Display Items

(source [a-to-z-list_v3.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v3.js))

Objective: Display the list items in the component without any categorization.

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

What happened in our web page?

# Part 2.3: Categorize Items by Letter

(source [a-to-z-list_v4.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v4.js))

Objective: Organize items by their starting letter.

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

(source [a-to-z-list_v5.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v5.js))

Objective: Add a navigation menu to jump to sections by letter.

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

    // Rest of the section creation code
  });
}
~~~

# Part 2.3: Add Scrolling and Back to Menu Link

(source [a-to-z-list_v6.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v6.js))

Objective: Implement smooth scrolling and a "Back to Menu" link.

~~~JavaScript
render() {
  // Previous code remains the same

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

  window.scrollTo({ top: y, behavior: 'smooth' });
}
~~~

# Part 2.3: Final Styling and Features

(source [a-to-z-list_v7.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v7.js))

Objective: Add final styling and conditional rendering based on attributes.

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
    ${this.hasAttribute('long') ? '<a class="back-to-menu" href="#menu">Back to Menu</a>' : ''}
  `;

  // Rest of the render method remains the same
}
~~~

# Part 2.3: A final working A to Z list

(source [a-to-z-list.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list.js))

~~~JavaScript
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
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}

customElements.define('a-to-z-list', AToZList);
~~~

# Part 2.3: You've created two web components

- The trivial `hello-clock`
- The more complex `a-to-z-list`

Congratulations! Time to update our application.

# Part 2.4: Using our A to Z list

1. Modify is `htdocs/index.html`
2. Wrap the `ul` list with our `<a-to-z-list></a-to-z-list>`
3. Add our component module `<script type="model" src="modules/a-to-z-list.js"></script>`
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
  - Do we make a custom element for this app that includes the index_recipes functions?

# Part 2.4: Think about the innerHTML, look at `index_recipes.js`

`listRecipes()`
: Gets the outer element, retrieves data and then invokes `populateUL()`

`populateUL()`
: Populates the UL lists with the data

# Part 2.4: Updating `listRecipes()`

- It should get the handle for the `<a-to-z-list></a-to-z-list>`
- It should retrieve the data
- It invoke `populateUL()` but populate that innerHTML!

# Part 2.4: Taking advantage of inheriting HTML element

(source [index_recipes_v2.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v2.js))

~~~JavaScript
async function listRecipes() {
 const aToZList = document.querySelector('a-to-z-list');
 console.log(aToZList);
 const ul = document.createElement('ul');
 const data = await getRecipes();
 populateUL(ul, data);
 aToZList.innerHTML = ul.outerHTML;
 // NOTE: we need to cause the aToZList to render again, ugly?
 aToZList.render()
}
~~~

What does the updates look like?

# Part 2.4: Problems?

- Ordering is weird, why?
- Do we always have to called `aToZList.render()` to update?

# Part 2.4: Ordering problem

- Get rid of dummy text "Recipe name goes here"

# Part 2.4: Adding an event handler to our component

- Which event is triggered with the line `aToZList.innerHTML = ul.outerHTML`?

1. Update our component to use a mutation observer
2. Remove our render call from `index_recipes.js`.

(source [a-to-z-list_v8.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/a-to-z-list_v8.js))
(source [index_recipes_v3.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/index_recipes_v3.js))

# Part 2.4: Lessons learned

- Remember that our web components, inherit from HTML, we can treat them like HTML elements
- Display elements can mutate, we should support them when implementing display components
  - The JavaScript defining a web component extends HTML, that should be the focus
  - The page level JavaScript is about adding behaviors at the page level
  - Balance the areas of responsibilities

# Part 2.5: Using the CSV Textarea Web Component, `<csv-textarea></csv-textarea>`

What does `<csv-textarea></csv-textara>` do?

- Typing in comma separated values is cumbersome, can me improve that
- We're going to submit the edit form as a JSON encoded document

# Part 2.5: Using the CSV Textarea Web Component, `<csv-textarea></csv-textarea>`

Next steps

1. Go to [CL-web-components](https://github.com/caltechlibrary/CL-web-components) 
  - [csv-textarea.js](https://github.com/caltechlibrary/CL-web-components/blob/main/csvtextarea.js)
2. Copy the component into your modules directory
3. Update your HTML markup
4. Update `utils.js` by adding a `saveRecipe` function
5. Test

# Part 2.5: Retrieving csv-textarae.js

On macOS or Linux.

~~~shell
curl -L -o htdocs/modules/csv-textarea.js \\
  https://raw.githubusercontent.com/caltechlibrary/CL-web-components/refs/heads/main/csv-textarea.js 
~~~

On Windows

~~~pwsh
irm `
  https://raw.githubusercontent.com/caltechlibrary/CL-web-components/refs/heads/main/csv-textarea.js `
  -Outfile ./htdocs/modules/csv-textarea.js
~~~

# Part 2.5: Fixing web form submission

The [utils.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/modules/utils.js) needs a`saveRecipe` function.

macOS and Linux

~~~shell
curl -L -o htdocs/modules/utils.js \\
  https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/utils.js
~~~

Windows

~~~pwsh
irm `
  https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs2/modules/utils.js `
  -Output htdocs/modules/utils.js
~~~

# Part 2.5: Fixing web form submission

- We need an event listener to trigger it
  - Which element?
  - What event?

# Part 2.5: Update the HEAD of edit_replace.html

Include our web component module in the head.

~~~html
  <head>
    <title>A recipe collection</title>
    <link rel="style" href="css/style.css">
    <script type="module" src="modules/csv-textarea.js"></script>
    <script type="module" src="modules/edit_recipe.js"></script>
  </head>
~~~

# Part 2.5: Update the HTML for edit_recipe.html

Wrap our ingredients `textarea`  in a `csv-textarea`.

~~~html
  <csv-textarea id="ingredients" name="ingredients"          
    title="ingredient,units (CSV data)" placeholder="flour,2 cups"
    cols="60"rows="10" 
    column-headings="Ingredients,Units" debug="true">
    <textarea id="ingredients" name="ingredients"
      title="ingredient,units (CSV data)" placeholder="flour,2 cups"
      cols="60"rows="10">
    </textarea>
  </csv-textarea>
~~~

# Part 2.5: Update the HTML for edit_recipe.html

Add the following at the bottom of the page before the `</body>`.

~~~HTML
<script type="module">
  import { saveRecipe } from './modules/utils.js';
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.addEventListener('submit', saveRecipe);
  });
</script>
~~~

# Part 2.5: Test updates

- What issue do you find?
- How could you improve this?

# Part 3: Exploring further

- The server side can be turn key using a JavaScript web page
  - When is it a good idea?
  - When is be an bad idea?
  - Should there be more layers?
  - Can we get away with static only sites?

# Part 3: Exploring further

- The traditional division of responsibilities in the browser is
  - HTML for structured data markup
  - CSS for visual design and layout
  - JavaScript to orchestrate behaviors
- Does Web components contradict that the division of responsibilities?
- Is progressive enhancement still relevant in 2025?
- Is it OK to require JavaScript in a web page?

# Part 3: My Recommendations

- Build with the grain of the web
  - Building blocks are HTML, CSS, JavaScript and HTTP protocol
- Take advantage of localhost
- Production, build in layers
  - access control with front end web service (Apache+Shibboleth, NginX+Shibboleth)
  - data validation with middle ware (localhost: Go, TypeScript or Python)
  - object storage with Dataset (localhost)

# Reference: Dataset

- [Dataset Project](https://caltechlibrary.github.io/dataset)
- [Dataset Repository](https://github.com/caltechlibrary/dataset)
- [Getting help with Dataset](https://github.com/caltechlibrary/dataset/issues)

# Reference: CL-web-components

[csv-textarea](https://github.com/caltechlibrary/CL-web-components/blob/main/csv-textarea.js)
: Wraps a textarea element and presents a editable table of cells

[a-to-z-list](https://github.com/caltechlibrary/CL-web-components/blob/main/a-to-z-list.js)
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

- View presentation: <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>
- View the repository: <https://github.com/caltechlibrary/t2t3_dataset_web_apps>
- Comment on this presentation: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>
- Author: R. S. Doiel, <mailto:rsdoiel@caltech.edu>

