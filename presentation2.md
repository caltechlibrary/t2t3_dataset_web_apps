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
updateDate: 2025-06-13
draft: false
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

This presentation builds on web we built in the Part 1.

This workshop is focused on enhancing our application using Web Components.

# What we'll learn

- What are Web Components?
- Why use Web Components?
- Anatomy of Web Components
- Using Web Compontents

# What we'll do

- Setup up a new static content directory for update our [recipes_api.yaml](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/recipes_api2.yaml)
- Create our first web component, "`<hello-clock></hello-clock>`"
- Develop an A to Z web component, "`<a-to-z-list></a-to-z-list>`"
- Use the [`<csv-textarea></csv-textarea>`](https://caltechlibrary.github.io/CL-web-components/CSVTextarea.html) from [CL-web-components](https://github.com/caltechlibrary/CL-web-components/releases) for our ingrediant lists

# Workshop: "A recipe for applications"

- Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation2.html>
- Download the presentation zip, <https://github.com/caltechlibrary/t2t3_dataset_web_apps/releases>
- Make suggestions for improving the workshop at <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>

# Getting started, Part II

### You'll need the following from Part I

- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/)
- [Dataset >= 2.2.8](https://caltechlibrary.github.io/dataset/INSTALL.html) (you may need to install the new version)
- The YAML, HTML and JavaScript you developed from Part I

We can start our second iteration of our application once you have these available.

# Part 2.1: Setting up for our new recipes app

## Next steps

1. copy the `htdocs` directory to `htdocs2`
2. copy `recipes_api.yaml` to `recipes_api2.yaml`
3. update `recipes_api2.yaml` to point to our `htdocs` content directory

# Part 2.1: Copying htdocs and recipes_api.yaml

On macOS, Linux and Windows using WSL

~~~shell
cp -fR htdocs htdocs2
cp recipes_api.yaml recipes_api2.yaml
~~~

On Windows in PowerShell

~~~pwsh
copy -Recurse htdocs htdocs
copy recipes_api.yaml recipes_api2.yaml
~~~

# Part 2.1: Update recipes_api2.yaml

Update the "`htdocs`" attribute to "`htdocs2`".

~~~yaml
#!/usr/bin/env -S datasetd -debug
host: localhost:8001
htdocs: htdocs2
collections:
  - dataset: recipes.ds
    keys: true
    create: true
    create_success: http://localhost:8001/display_recipe.html
    create_error: http://localhost:8001/edit_recipe.html
    read: true
    update: true
    delete: false
    query:
      list_recipes: |
        select src
        from recipes
        order by src->>'name'
~~~

# Part 2.3: Testing a new instance

- Test our new instance
- Shutdown down and restart datasetd to debug YAML changes

~~~shell
datasetd recipes_api2.yaml
~~~

We're have our web service working, time for Web Components.

# Part 2.2: The "What" of Web Components

- Web Components are a W3C standard to allowing you to extend HTML
  - (Web Components inherit, include accessibility features)
- A Web Component encapsulates the HTML, CSS and JavaScript use to create a new HTML Element
  - (They encourage sensible code re-use)
- Web Components are re-usable of blocks of structure, function and presentation

# Part 2.2: The "Why" of Web Components

- Web components provide a sustainable way to extend HTML language to fit your needs
- They simplify use because they are expressed as HTML elements
- Web components cleanly encapsule HTML, CSS and JavaScript
  - They do not interfer with other resources or elements on your page!
  - They are compatible with progressive enhancement techniques
- They can help normalize user experience as a part of your design system

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

~~~javascript
// Define our new element as a class
class HelloClock extends HTMLElement {
  // Hook used by browser to instanciate the element in the page
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

- [htdocs/clock.html](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/clock.html)

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

1. Point your web browser at <http://localhost:8001/clock.html>
2. Open your developer tools and reload the page
3. Notice the logs provided by Dataset Web Service

# Part 2.2: Congradulations

## You've built your first Web Component!!!!

Let's take a quick break and stretch before moving forward

# Part 2.3: Building an A to Z list web component

Q: What does the A to Z list web component do?

A: Wraps a standard UL list providing A to Z navigation.

# Part 2.3: Building an A to Z list web component

1. Create an HTML to test with, `htdocs2/a-to-z-list.html`
2. Create our Web Component, `htdocs2/modules/a-to-z-list.js`

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

Start out with a minimal Class definition and customElement definition

~~~javascript
/**
 * a-to-z-list.js, this wrap a standard UL list providing A to Z navigation list
 */
export class AToZList extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
  }

}
customElements.define('a-to-z-list', AToZList);
 ~~~

NOTE: the constructor and that the web component does do any thing yet.

# Part 2.3: Introducing Shadow DOM

You can build your web component in the Shadow DOM that way you can sprinkle into your document as needed. We need to include that in our contrustor.

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

We use the `connectedCallback()` method to to call a render method. This is what makes our Shaddow DOM ready. What happened in our web page?

~~~JavaScript
export class AToZList extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }

  connectedCallback() { this.render(); }

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
      <div id="list-container">This is where our A to List will go</div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('a-to-z-list', AToZList);
~~~

# Part 2.3: Basic Structure of our component using Showdow Dom

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

# Part 2.3: Categorize Items by Letter

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
  // NOTE: Next slide will start updateing here
  Object.keys(sections).forEach(letter => {
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

Objective: Add a navigation menu to jump to sections by letter.

~~~JavaScript
render() {
  // Previous code remains the same until the sections loop
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

Objective: Implement smooth scrolling and a "Back to Menu" link.

~~~JavaScript
scrollToSection(section) {
  const yOffset = -100;
  const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
}

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
~~~

# Part 2.3: Final Styling and Features

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

See [a-to-z-list.js](htdocs2/modules/a-to-z-list.js)

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


# Part 2.4: Using existing Web Components, `<csv-textarea></csv-textarea>`

- [CL-web-components]() provides a nice [CSV Textarea]()
- Copy the component into your modules directory
- Update you HTML markup
- Test

# Part 2.4: What does `<csv-textarea></csv-textara>` do?

- Typing in comma separated values is cumbersome, can me improve that
- We're going to submit the edit form as a JSON encoded document

# Part 2.4: Fixing web form submission

- The `utils.js` module includes a `saveRecipe` function
- We need an event listener to trigger it
  - Which element?
  - What event?

# Part 2.4: Update the HTML for edit_recipe.html

Add the following at the bottom of the page before the `</body>`.

~~~HTML
<script type="module">
  import { saveRecipe } from './modules/utils.js';
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.addEventListener('submit', saveRecipe);
  });
</script>
~~~

# Part 2.5: Using an existing Web Component

1. Extend the HTML elements available
2. Implement components as JavaScript Modules

# Part 2.5: CL-web-components

- CL-web-components, a collection of web components designed for Caltech Library
- Use your web browser retrieve the latest release

<https://github.com/caltechlibrary/CL-web-components/releases>

# Part 2.5: Copy the web components to the modules directory

- Unzip just the JavaScript files
- Move the JavaScript files in the zip file to `htdocs2/modules/`.

~~~shell
unzip $HOME/Downloads/cl-web-components-0.0.6.zip *.js
mv -v *.js htdocs2/models/
~~~

# Part 2.5: Adding CSVTextarea to edit_recipe.html

- edit `htdocs2/edit_recipe.html`
  - Include the CSVTextarea JavaScript module in the document head
  - Wrapping the "ingredients" textarea with `<csv-textarea>`

See: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/edit_recipe.html>

# Part 2.5: What are the attributes needed in a `<csv-textarea>`?

- copy the attributes form the "ingredients" textarea to the `<csv-textarea>`
- Add an these attributes to `<csv-textarea>`
  - `column-headings="Ingredients,Units"`
  - `debug="true"`

# Part 2.5: Restart recipes_api2.yaml and test

Start up our web service

~~~
dataset recipes_api2.yaml
~~~

1. Point your browser at <http://localhost:8002/edit_recipe.html>
2. Turn on your developer tools
3. Test the web component, what's the problem you see?

# Part 2.5: Getting the table populated, update `utils.js`

CSVTextarea has the ability to be updated from CSV text. Let's do that.

In `edit_recipe.js` you need to find this.

~~~JavaScript
if (data["ingredients"] !== undefined) {
  ingredientsTextarea.innerHTML = data["ingredients"];
}
~~~

And replace it with something like this.

~~~JavaScript
if (data["ingredients"] !== undefined) {
  ingredientsTextarea.fromCSV(data['ingredients']);
}
~~~

# Part 2.5: Test and debug

- Do you find other problems?

# Part 3: Exploring further

- The server side can be turn key using a JavaScript web page
  - When is it a good idea?
  - When is be an bad idea?
- Moving from a single layer stack to a two or three layer stack
  - Dataset behind a front end web server
  - Dataset behind middle ware
- Is this approach sustainable?

# Part 3: Exploring Human Interfaces

- Why bother with Web Components? 
  - What's missing?
- What are the assumptions in this approach? 
  - Are they valid?

# Part 3: Exploring Human Interfaces

- The traditional division of responsibilities in the browser is
  - HTML for structured data markup
  - CSS for visual design and layout
  - JavaScript to orchestrate behaviors
- Does Web components contradict that the division of responsibilities?
- Is progressive enhancement is still relevant in 2025?
  - Is it OK to require JavaScript in a web page?

# Part 3: My Recommendations

- Build with the grain of the web
  - Building blocks are HTML, CSS, JavaScript and HTTP protocol
- Take advantage of localhost
- Production, build in layers
  - access control with front end web service (Apache+Shibboleth, NginX+Shibboleth)
  - data validation with middle ware (localhost: Go, TypeScript or Python)
  - object storage with Dataset (localhost)

# Part 3: What I am still mulling over?

- Dataset can shrink the stack but does not remove the need for middleware (yet)
- Web Components offer the possibility of consistent interfaces across sites
  - They can help with accessibility
- I think Web Components ultimately simplify things
  - Trade off: individual components can be complex
- REST services force us to middleware or Browser JavaScript
  - Is it reasonable to require JavaScript (or WASM)?
  - Is there a simpler abstraction?

# Reference: Dataset

- [Dataset Project](https://caltechlibrary.github.io/dataset)
- [Dataset Repository](https://github.com/caltechlibrary/dataset)
- [Getting help with Dataset](https://github.com/caltechlibrary/dataset/issues)

# Reference: CL-web-components

[CSVTextarea](https://github.com/caltechlibrary/CL-web-components/blob/main/csvtextarea.js)
: Wraps a textarea element and presents a editable table of cells

[AToZUL](https://github.com/caltechlibrary/CL-web-components/blob/main/a_to_z_ul.js)
: Wraps a UL list and creates an A to Z list

[SortableTable](https://github.com/caltechlibrary/CL-web-components/blob/main/sortable_table.js)
: Wraps an HTML table making it sort-able and filterable on a column

- Getting help with CL-web-components, <https://github.com/caltechlibrary/CL-web-components/issues>.

# Reference: Web Components

- [MDN Examples on GitHub](https://github.com/mdn/web-components-examples)
- [Examples of Accessible Components](https://github.com/scottaohara/accessible_components)
- [Awesome Standalones](https://github.com/davatron5000/awesome-standalones)
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

