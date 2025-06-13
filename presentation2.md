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

Welcome everyone. This is part 2 of a hands on workshop, enhancing the user experience through web components.

- What are Web Components?
- Why use Web Components?
- Anatomy of Web Components
- Using Web Compontents

# Workshop: "A recipe for applications"

## What we'll do

- We'll evolve our recipes app from simple HTML into a rich recipe curation tool
- We'll continue working with HTML, JavaScript, JSON and YAML

## What we'll learn

- What Web Components are
- Why use Web Components
- The basic anatomy of a Web Component
- How to use [CL Web Components](https://github.com/caltechlibraryCL-web-components)

# Workshop: "A recipe for applications"

- Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation2.html>
- Download the presentation zip, <https://github.com/caltechlibrary/t2t3_dataset_web_apps/releases>
- Make suggestions for improving the workshop at <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>

# Getting started, Part II

### You'll need the following from Part I

- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/)
- [Dataset >= 2.2.7](https://caltechlibrary.github.io/dataset/INSTALL.html)
- The YAML, HTML and JavaScript you developed from Part I

We can start our second iteration of our application once you have these available.

# Part 2.1: The What of Web Components

- Web Components are a W3C standard to allowing you to extend HTML
  - (Extentions inherit, include accessibility features)
- A Web Component encapsulates the HTML, CSS and JavaScript
- Web Components are re-usable of blocks of structure, function and presentation

# Part 2.1: The Why of Web Components

- Web components provide a sustainable way to extend HTML language to fit the needs your site or application
- They simplify use because they are expressed as HTML elements
- Web components cleanly encapsule HTML, CSS and JavaScript
  - They do not inter with other resources or elements on your page!
- They encourage code sensible re-use
- They can help normalize user experience through providing predictable elements on which to structure sites
- They can are compatible with progressive enhancement techniques

# Part 2.1: The Anatomy of a Web Component

- A component is implemented as a JavaScript class
  - The class extends an existing HTML element (inheriting its features)
- The class contains a `connectedCallback()` method
- Is registered using the `customElements.define()` method
  - Example: `customElements.define( 'hello-clock', HelloClock );`

# Part 2.1: The "Hello Clock" Web Component

- Let's create a web component called "hello-clock" ("htdocs/modules/hello-cock.js")
- "hello-clock" will extended the HTML element
- It will display a hello message and the time

~~~html
<hello-clock>Hi There!</hello-clock>
~~~

This will display something like, "Hi There! 09:27:23 GMT-0700 (Pacific Daylight Time)".

# Part 2.1: "hello-clock.js" defines the web component

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

# Part 2.1: Now lets create an HTML Page using "Hello Clock"

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

# Part 2.1: Fire up our web service and test "Hello Clock"

~~~shell
dataset -debug recipes_api.yaml
~~~

Point your web browser at <http://localhost:8001/clock.html>

# Part 2.1: Congradulations

## You've built your first Web Component!!!!

# Part 2.2:  Recipes version 2

What we are doing next

- Creating a new, `recipes_api2.yaml`
- We'll re-use our dataset collection called, `recipes.ds`
- Creating a new directory structure for our static content called, `htdocs2`

# Part 2.1: Bootstrap from version 1

~~~shell
dataset init recipes2.ds
cp recipes_api.yaml recipes_api2.yaml
cp -vR htdocs htdocs2
~~~

On Windows:

~~~pwsh
dataset init recipes2.ds
copy recipes_api.yaml recipes_api2.yaml
copy -Recurse htdocs htdocs2
~~~

(NOTE: The first line should look familiar, the others are just time savers)

# Part 2.1: Updating our YAML configuration

- edit our [recipes_api2.yaml](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/recipes_api2.yaml)
- update the `htdocs` reference
- update the port number in hosts to 8002
- update the dataset to `recipes2.ds`
- What additional files need to change?
  - did we hard code the collection name in HTML?
  - did we hard code the collection name in JavaScript?

# Part 2.1: Testing a new instance

- Test our new instance
  - What is broken?
  - Did we catch all the places with hard coded collection names?
  - What about behaviors?
- Shutdown down and restart datasetd to debug YAML changes

~~~shell
datasetd recipes_api2.yaml
~~~

(NOTE: note the "d" at the end of "datasetd")

# Part 2.2: Desirable changes

- Typing in comma separated values is cumbersome, can me improve that
- We're going to submit the edit form as a JSON encoded document

# Part 2.2: Fixing web form submission

- The `utils.js` module includes a `saveRecipe` function
- We need an event listener to trigger it
  - Which element?
  - What event?

# Part 2.2: Update the HTML for edit_recipe.html

Add the following at the bottom of the page before the `</body>`.

~~~HTML
<script type="module">
  import { saveRecipe } from './modules/utils.js';
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.addEventListener('submit', saveRecipe);
  });
</script>
~~~

# Part 2.2: Restart datasetd and test

~~~shell
datasetd -debug recipes_api2.yaml
~~~

Test using your web browser.

# Part 2.3: Improving the UI with Web Components

1. Extend the HTML elements available
2. Implement components as JavaScript Modules

# Part 2.3: CL-web-components

- CL-web-components, a collection of web components designed for Caltech Library
- Use your web browser retrieve the latest release

<https://github.com/caltechlibrary/CL-web-components/releases>

# Part 2.3: Copy the web components to the modules directory

- Unzip just the JavaScript files
- Move the JavaScript files in the zip file to `htdocs2/modules/`.

~~~shell
unzip $HOME/Downloads/cl-web-components-0.0.6.zip *.js
mv -v *.js htdocs2/models/
~~~

# Part 2.2: Adding CSVTextarea to edit_recipe.html

- edit `htdocs2/edit_recipe.html`
  - Include the CSVTextarea JavaScript module in the document head
  - Wrapping the "ingredients" textarea with `<csv-textarea>`

See: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/edit_recipe.html>

# Part 2.2: What are the attributes needed in a `<csv-textarea>`?

- copy the attributes form the "ingredients" textarea to the `<csv-textarea>`
- Add an these attributes to `<csv-textarea>`
  - `column-headings="Ingredients,Units"`
  - `debug="true"`

# Part 2.2: Restart recipes_api2.yaml and test

Start up our web service

~~~
dataset recipes_api2.yaml
~~~

1. Point your browser at <http://localhost:8002/edit_recipe.html>
2. Turn on your developer tools
3. Test the web component, what's the problem you see?

# Part 2.2: Getting the table populated, update `utils.js`

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

# Part 2.2: Test and debug

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

