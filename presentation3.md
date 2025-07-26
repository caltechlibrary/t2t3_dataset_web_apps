---
title: "A recipe for applications: Dataset & Web Components (Part 3)"
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
abstract: |
  A workshop demonstrating Web Components by enhancing our previous
  recipe application prototype.
institute: |
  Caltech Library,
  Digital Library Development
description: workshop presentation
slidy-url: .
css: styles/coffee-and-cream.css
createDate: 2025-05-29
updateDate: 2025-07-25
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

This presentation builds on what we built in the Part 2.

This workshop is focused on enhancing our application with Web Components from [CL-web-components](https://github.com/caltechlibrary/CL-web-components).

# What we'll learn

- What is [CL-web-components](https://github.com/caltechlibrary/CL-web-components)?
- How do you use these web components?

# What we'll do

- Continue working on a recipes site
- Use CL-web-components to enhance the usability
  - We'll use `<table-sortable></table-sortable>` to enhance our recipe index
  - We'll use `<textarea-csv></textarea-csv>` to enhance data entry of recipes

# Workshop: "A recipe for applications"

- Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation3.html>
- Download the presentation zip, <https://github.com/caltechlibrary/t2t3_dataset_web_apps/releases>
- Make suggestions for improving the workshop at <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>

# Getting started, Part III

### You'll need the following from Part II

- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/)
- [Dataset >= 2.3.2](https://caltechlibrary.github.io/dataset/INSTALL.html) (or latest release)
- cURL or irm
- The YAML, HTML and JavaScript you developed from Part I

# Starting up our web service

- The web service works just like our last session
- We'll be building browser side, updating the htdocs directory
  - Ready to dive into using CL-web-components?

~~~shell
datasetd recipes_api.yaml
~~~

# Part 1.1: CL-Web-Components

<https://github.com/caltechlibrary/CL-Web-Components>

- A small collection of ready to go web components
- You can use them individually
  - footer-global.js, footer-global-lite.js provides standardized footers
  - table-sortable.js turns a plain table into a sortable table with column level filtering
  - textarea-csv.js turns a textarea containing CSV into an editable table
  - textarea-agent-list.js turns a textarea containing JSON people or organization objects into an editable list
  - ul-a-to-z-list.js turns a UL list into an A to Z list.
- You can use them collectively
  - cl-web-components.js provides all these elements in one JavaScript file

# Part 1.2: Textarea CSV

- What does `<textarea-csv></textarea-csv>` do?
  - Typing in comma separated values is cumbersome, can me improve that?
  - The web component presents a table view based on the CSV content in the wrapped textarea
  - If the web browser has JavaScript disabled the textarea still works for typing in comma delimited data

# Part 1.3: How to using Textarea CSV

See <https://caltechlibrary.github.io/CL-Web-compenents/textarea-csv.html>

# Part 1.4: Using Textarea CSV in our web form

Next steps

1. Retrieve [textarea-csv.js](https://raw.githubusercontent.com/caltechlibrary/CL-web-components/refs/heads/main/textarea-csv.js "you may retrieve this file with curl or irm")
2. Copy the component into your modules directory
3. Update your HTML markup
4. Update `utils.js` by adding a `saveRecipe` function
5. Test

# Part 1.5: Retrieving textarea-csv.js

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

# Part 1.6: Move into our modules directory

On macOS or Linux.

~~~shell
mv textarea-csv.js htdocs/modules
~~~

On Windows

~~~pwsh
move textarea-csv.js htdocs/modules
~~~

# Part 1.7: Update your HTML markup

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

# Part 2.1: Textarea CSV and Web Forms

What happens when I press "save" button in the web form?

- Does the submit process need change? 
- What are the options?
  - submit as a URL encoded document?
  - submit as JSON encoded document?

# Part 2.2: Textarea CSV and Web Forms

We're missing the script element that imports our component.

Include this in the head element of the page.

~~~html
<script type="module" src="modules/textarea-csv.js" defer></script>
~~~

Try submitting the form again. What happens?

# Part 2.3: Fixing web form submission

- We need an event listener to trigger it
  - Which element?
  - What event?

# Part 2.3: Fixing web form submission

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

# Part 2.3: Fixing web form submission

Add the following at the page before the to process the submission.

~~~HTML
<script type="module" defer>
  import { saveRecipe } from './modules/utils.js';
  const form = document.addEventListener('submit', saveRecipe);
</script>
~~~

# Part 2.4: Test updates

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

[table-sortable](https://github.com/caltechlibrary/CL-web-components/blob/main/table-sortable.js)
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
  - <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation3.html>
- View the repository: <https://github.com/caltechlibrary/t2t3_dataset_web_apps>
- Comment on this presentation: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>
- Author: R. S. Doiel, <mailto:rsdoiel@caltech.edu>
