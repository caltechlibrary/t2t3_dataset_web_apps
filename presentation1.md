---
title: Recipe for an application, Dataset and CL Web Components
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
institute: |
  Caltech Library,
  Digital Library Development
description: T2T3 presentation
urlcolor: blue
linkstyle: bold
aspectratio: 169
createDate: 2025-05-29
updateDate: 2025-06-03
draft: true
pubDate: TBD
place: Caltech
date: TBD
section-titles: false
toc: true
keywords: [ "microservices", "SQLite3", "Deno", "TypeScript", "Dataset" ]
url: "https://caltechlibrary.github.io/t2t3_dataset_web_app/presentation/presentation1.html"
---

# Dataset and a Web Components

## What we'll do

- We'll build a web application for managing a list of recipes
- Work with HTML, a little JavaScript, JSON and YAML

## What we'll learn

- How to create a JSON API using a simple YAML file and using a simple SQL SELECT statement
- How to enhance our HTML using Web Components from [CL Web Components](https://github.com/caltechlibraryCL-web-components)

Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>

# Getting started, requirements

### You probably already have these, if not install them

- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/) (I'm assuming Firefox for this tutorial)

### You will need to install dataset

- [Dataset](https://caltechlibrary.github.io/dataset), get the latest release

We can start our first iteration of our application once you have these available.

# Getting started, four parts

1. What are we building, how will we build it?
2. Setting up our web service
3. Creating our static content
4. Enhancements with Web Components

# Part 1: What are we building?

GOAL: A simple web application that lets us curate a list of recipes.

# Part 1: What are the parts of our application?

1. A web service for managing the recipe collection
2. A way to browse recipes by name
3. A page to display a recipe
4. A web form for adding or edit our recipes

# Part 1: What is a recipe?

- A "key", the unique identifier of a recipe
- A name
- A list of ingredients and measures (CSV data)
- A procedure describing the preparation process (text)

# Part 1: Strategy.

1. Setting up our web service
2. Mock up using HTML
3. Wire up and test

# Part 2: Setting up our web service

1. create our recipes.ds collection
2. load sample data into our recipes.ds collection
3. Configure and run our collection as a web service

# Part 2: creating our collection

We use the `dataset` command line program to initialize a dataset collection.

~~~shell
dataset init recipes.ds
~~~

# Part 2: Loading some sample data

We can now load some sample data, see [recipes.jsonl](recipes.jsonl).

~~~shell
dataset load recipes.ds <recipes.jsonl
~~~

# Part 2: create an static content directory directory

~~~shell
mkdir htdocs
mkdir htdocs/modules
mkdir htdocs/css
~~~

# Part 2: Setting up our web service, configuring the web service

`datasetd` provides a turn key web service defined by a simple YAML file. It can host
one or more dataset collections. It provides a static file service as well as a JSON API
for each collection. Let's call this [recipes_api.yaml](recipes_api.yaml).

# Part 2: Setting up our web service, configuring the web service

~~~yaml
#!/usr/bin/env -S datasetd
host: localhost:8001
htdocs: htdocs
collections:
  - dataset: recipes.ds
    keys: true
    create: true
    read: true
    update: true
    delete: true
    query:
      list_recipes: |
        select src
        from recipes
        order by src->>'name'
~~~

# Part 2: Starting and stopping the web service

Starting the web service.

~~~shell
datasetd recipes_api.yaml
~~~

- Go do <http://localhost:8001/api/version>
- Look at the terminal window, do you see the log message for the request?
- You can shutdown the service by press control and C (Ctrl-C) in the terminal session

# Part 3: Creating our static content

The web service is running but if you go to the root URL, <http://localhost:8001/>, you'll get a 404 page. We need to create HTML pages to hold the content that will be curated in our recipes application.  We'll be create three HTML documents and four JavaScript modules to help with that. But before we proceed with coding let's think about what we're curating.

# Part 3:Mock up, what does our metadata look like?

name
: A line of text. Held by an`input` element

ingredients
: A CSV table. Held by a `textarea` or for display a `table`.

procedure
: Free text describing how to prepare the dish. Held by a `textarea` element

We'll need a submit button to save a new or edited recipe.

# Part 3: What are our web pages?

[htdocs/index.html](htdocs/index.html)
: Display a list of our recipes

[htdocs/display.html](htdocs/display_recipe.html)
: A page that shows the recipe

[htdocs/edit_recipe.html](htdocs/edit_recipe.html)
: A page used to add and edit recipes we've collected

# Part 3: populating our pages

We'll create four modules, one specific to each HTML page and one utility module

[htdocs/modules/list_recipes.js](htdocs/modules/list_recipes.js)
: Display a list of our recipes

[htdocs/modules/display_recipe.js](htdocs/display_recipe.js)
: A page that shows the recipe

[htdocs/modules/edit_recipe.js](htdocs/modules/edit_recipe.js)
: A page used to add and edit recipes we've collected

[htdocs/modules/utils.js](htdocs/modules/utils.js)
: This module handles retrieving data from the JSON API and finding the object's key

# Part 3: Fire up our web service

In a terminal run our startup command 

~~~shell
datasetd recipe_api.yaml
~~~

# Part 3: Test using your web browser

1. Go to <http://localhost:8001>
2. In your browser open your "developer tools"
3. Reload the page and monitor the loads
4. Click through the sites

# Part 3: Debugging and improving

1. There will be issues you need to debug
2. What happens when you add a recipe?
3. What happens when you hen you update a receipt?
4. Can any of this be improved?

# Intermission

Let's take a short break then we'll comeback and iterate.

# Part 1, version 2

We're going to set aside the prototype noting what worked and what didn't work. 

# Part 1, version 2: Setting up

1. Create a new dataset collection called `recipes2.ds`
2. Create a `recipes_api2.yaml`
3. Create new directory structure for our static content called `htdocs2`

# Part 1, version 2: Setting up

On macOS and Linux

~~~shell
dataset init recipes2.ds
cp recipes_api.yaml recipes_api2.yaml
cp -vR htdocs htdocs2
~~~

on Windows

~~~pwsh
dataset init recipes2.ds
copy recipes_api.yaml recipes_api2.yaml
copy -Recurse htdocs htdocs
~~~

# Part 1, version 2: Updating our YAML configuration

- edit our `recipes_api2.yaml`
- update the `htdocs` reference
- update the port number in hosts to 8002
- update the dataset to `recipes2.ds`
- Are their other files that need to be edited?

# Part 1, version 2: Testing a new instance

1. Test our new instance
  a. what is broken?
  b. Are there places where hard code collection needs updating?
2. Shut it down before we proceed.

~~~shell
dataset recipes_api2.yaml
~~~

# Part 2, version 2: Introducing Web Components

1. A means of extending HTML elements supported in your web browser
2. Implemented as JavaScript Modules

# Part 2, version 2: CL-web-components

- CL-web-components, a collection of web components designed for Caltech Library
- Retrieve the latest versions at <https://github.com/caltechlibrary/CL-web-components/releases>

# Part 2, version 2: Web Components, CL-web-components

CSVTextarea
: Wraps a textarea element and presents a editable table of cells

AToZUL
: Wraps a UL list and creates an A to Z list

SortableTable
: Wraps an HTML table making it sort-able and filterable on a column

# Part 2, version 2: Adding CSVTextarea to edit_recipe.html

- copy `csvtextarea.js` to the modules directory under htdocs2
- edit `htdocs/edit_recipe.html` to include the CSVTextarea module in the document head
- edit `htdocs/edit_recipe.html` wrapping the ingredients textarea with our csvtextarea

# Part 2, version 2: Restart recipes_api2.yaml and test

Start up our web service

~~~
dataset recipes_api2.yaml
~~~

1. Point your browser at <http://localhost:8002/edit_recipe.html>
2. Turn on your developer tools
3. Test the web component

# Part 3, version 2: solving the missing redirect from submit status

- In version 1 when we created or updated and element we were taken to a status page
- What we want to do is go to a more logical place
- We can use JavaScript to handle the form submission and then redirect to the right place

# Part 3, version 2: Adding a listener for form submission

1. Add a script element in `edit_recipe.html`
2. Add an event listener for the form that uses `saveRecipe` function from `utils.js`
3. Reload page and test our revision

# Part 3, version 2: Anatomy of our saveRecipe

1. Retrieve the data from the web form
2. Use fetch to send the data and receive a response
3. Based on the response decide where to go

# Part 3, version 3: Exploring further

- [MDN](https://developer.mozilla.org/en-US)
- LLMs, including ones you can run locally via Ollama

# What we've covered and some questions

- The server side can be turn key using a JavaScript web page
  - What is it a good idea?
  - When is be an bad idea?

# What we've covered and some questions

- The traditional division of responsibilities in the browser is
  - HTML for structured data markup
  - CSS for visual design and layout
  - JavaScript to orchestrate behaviors
- Why bother with Web Components?

# Misc thoughts

- Progressive enhancement is still relevant in 2025
- Web Components offer the possibility of consistent rich behaviors across
  websites and web applications (bonus they can be used to to ensure accessibility)
- There are still times you want to write custom middle ware, example COLD

# Conclusion

- Build with the grain of the web
  - the building blocks are HTML, CSS and JavaScript
- localhost services versus internet services
  - security concerns

# Reference: Dataset

- [Dataset Project](https://caltechlibrary.github.io/dataset)

# Reference: Programming Languages

- [HTML5](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content), structured content
- [CSS](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics), layout and style
- [JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting), behaviors and web components
- [SQL](https://sqlite.org)
  - [SQLite Tutorial](https://www.sqlitetutorial.net/)

# Reference: Data formats

- [JSON](https://www.json.org)
- [JSON Lines](https://jsonlines.org)
- [YAML](https://yaml.org/)
