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
updateDate: TBD
draft: true
pubDate: TBD
place: Caltech
date: TBD
section-titles: false
toc: true
keywords: [ "microservices", "SQLite3", "Deno", "TypeScript", "Dataset" ]
url: "https://caltechlibrary.github.io/dataset/presentation/presentation1.html"
---

# Recipe for an application, Dataset and a Web Component

## What we'll do

- We'll build a web application for managing a list of recipes
- Work with HTML, a little JavaScript, JSON and YAML

## What we'll learn

- How to create a JSON API using a simple YAML file and a simple SQL
- How to enhance our HTML using Web Compents from [CL Web Components](https://github.com/caltechlibraryCL-web-components)

Follow along at <https://caltechlibrary.github.com/t2t3_dataset_web_apps/presentation1.html>

# Recipe for an application, Dataset and a Web Component

## Required

### You probably aready have this
- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/)

### You'll need to install this

- [Dataset](https://caltechlibrary.github.io/dataset)

NOTE: you need to be comfortable using the terminal application)

# Recipe for an application, Dataset and a Web Component

## Suggested

- [cURL](https://curl.se/docs/manpage.html) (for testing and debugging the JSON API)
- [jq](https://jqlang.org)
- [yq](https://mikefarah.gitbook.io/yq)
- [htmlq](https://github.com/mgdm/htmlq)

# Getting started, what are we creating?

A simple web application that lets us curate a list of recipes.

# Getting started, what are the parts of our application?

1. A web form to adding or edit our recipes
2. A page to display our recipe
2. A way to browse recipes
3. A web service for managing our recipe collection

# Getting started, what is a recipe?

(for purposes of this workshop)

- A unique identifier (a.k.a a key)
- A name
- A URL where it was found
- A list of ingredients and measures (table)
- A description of the preparation process

# Getting started, strategy.

- Mockup using HTML
- Defining some behaviors
- Setting up our web service
- Wire up our human interface

# Mockup, What would be needed from a web form?

name
: `input` element

url
: `input` element

ingredients
: `textarea` or table?

preparation
: `textarea`

We need a submit button.

# Mockup, What would the web form look like?

~~~html
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>A recipe collection</title>
    <link rel="style" href="css/style.css">
    <script type="model" src="js/edit_recipe.js"></script>
  </head>
  <body>
    <nav>
      <a id="list-recipe" href="./">List Receipt</a> <a id="display-recipe" href="display.html">Display</a>
    </nav>

    <form id="edit-recipe" method="" action="">
      <div>
        <label set="key">Key</label>
        <input id="key" name="key" type="text" value="" title="Unique identfier for recipe" placeholder="lower case unique text" size="60">
      </div>

      <div>
        <label set="name">Name</label>
        <input id="name" name="name" type="text" value="" title="The common name for this recipe" placeholder="e.g. fry bread" size="60">
      </div>

      <div>
        <label set="url">Source URL</label>
        <input id="url" name="url" type="url" value="" title="The URL where the recipe was found" placeholder="e.g. https://cullanary.example.edu/fry-bread" size="80">
      </div>

      <div>
        <label set="ingredients">Ingredients</label>
        <textarea id="ingredients" name="ingredients" title="ingredient,units (CSV data)" placeholder="flour,2 cups" cols="60"rows="5">
ingredient,units
        </textarea>
      </div>

      <div>
        <label set="preparation">Preparation</label>
        <textarea id="preparation" name="preparation" title="preparation steps as free text" placeholder="measure and pour flower in a bowl. Add egg ..." cols="60"rows="10">
        </textarea>
      </div>

      <div><input id="save" name="save" type="submit" value="Save Recipe"> <input id="cancel" name="cancel" type="reset" value="Cancel"></div>
    </form>
  </body>
</html>
~~~


This is our edit page so it should be named "edit.html" in the "htdocs" directory.

# Mockup, What how about displaying our recipe?

We can use an UL list to list the recipe by name and link to the display page.

~~~html
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>A recipe collection</title>
    <link rel="style" href="css/style.css">
    <script type="model" src="js/display_recipe.js"></script>
  </head>
  <body>
    <nav>
      <a id="list-recipe" href="./">List Receipt</a> <a id="edit-recipe" href="edit.html">Edit</a>
    </nav>
    <h1 id="name">recipe name goes here</h1>
    <h2>Ingredients</h2>
    <div id="ingredients">ingredients goes here</div>
    <h2>Preparation</h2>
    <div id="preparation">preparation instructions goes here</div>
  </body>
</html>
~~~

This is our landing page so it should be named "recipe.html" in the "htdocs" directory.

# Mockup, What about browsing our recipes?

We can use an UL list to list the recipe by name and link to the display page.

~~~html
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <title>A recipe collection</title>
    <link rel="style" href="css/style.css">
  </head>
  <body>
    <h1>Available Recipes</h1>
    <ul id="recipe-list">
      <li><a href="" title="View recipe">Recipe name goes here</a></li>
    </ul>
  </body>
</html>
~~~

This is our landing page so it should be named "index.html" in the "htdocs" directory.

# Behaviors, what actions are needed?

## CRUD-Q

- create a recipe
- retrieve a recipe
- update a recipes
- delete a recipe
- query our collection of recipes

# Behaviors, use JavaScript Luke

- retrieve and drop data into our HTML pages
- handle form submission
- to create web components to simplify our HTML and make it more user friendly

# Behaviors, our web service provides our data source

- `dataset` sets up our collection 
- `datasetd` provides our web service
- web service is defined using YAML

# Behaviors, create our collection

`dataset` is a command line tool for interacting with collections of JSON documents.

This will create our "recipes.ds" collection.

~~~shell
dataset init recipes.ds
~~~

Populate the collection with some test data, [download recipes.jsonl]().

~~~shell
dataset load recipes.ds <recipes.jsonl
~~~

# Behaviors, setting up with YAML

`datasetd` provides a turn key web service defined by a simple YAML file. It can host
one or more dataset collections. It provides a static file service as well as a JSON API
for each collection.

~~~yaml
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
        selecet src
        from recipes
        order by name
~~~

Let's call this "recipes_api.yaml".

# Wiring thingss up, start "recipes_api.yaml"

In one terminal windows use the following command.

~~~shell
datasetd recipes_api.yaml
~~~

Point your web browser at browser at <http://localhost:8001> and you should see your HTML pages.

# Wiring up, we use JavaScript and the JSON API to populate our pages

We will create the following:

- [htdocs/js/edit_recipes.js](htdocs/js/edit_recipe.js)
- [htdocs/js/display_recipe.js](htdocs/js/display_recipe.js)
- [htdocs/js/list_recipes.js](htdocs/js/list_recipes.js)

You can download them from <https://github.com/caltechlibrary/t2t3_dataset_web_apps> if you're following along.

# Debugging

Work as a group

# Prototype

# Wait but this is ugly!

This is just the minimum prototpye

# Improving our application, vanilla CSS

~~~css
/* Example CSS, how minimal can we be? */
~~~

# Improving our application, leveraging web components

We can retrieve the following from [CL-web-components](https://github.com/caltechlibrary/CL-web-components)

- [a_to_z_ul.js]() -> htdocs/js/a_to_z_ul.js
- [csvtextarea.js]() -> htdocs/js/csvtextarea.js
- [sortable_table.js]() -> htdocs/js/sortable_table.js


# Recipe for an application, Dataset and a Web Component

- What is Dataset?
- Simplification by dividing responsibilities
- Software required and recommended
- Defining a light weight metadata web service using YAML
- Building a user interface with HTML, CSS and JavaScript
- Conclusion

# What is Dataset?

- A JSON document (metadata) collection manager
- A command line tool
- A web service

# Dividing responsibilities

- a localhost web service implements metadata collection curation
  - CRUD-Q: create, read, update, delete and query
- browser side user interface using "static" content (HTML, CSS and JavaScript)
- a front end web server can control access and authentication (example [COLD](https://apps.library.caltech.edu/cold)

# How does Dataset simplify web applications?

- Dataset provides your backend system
  - Define it using a YAML document
  - Run it on  "localhost" on a port of your choosing
  - It provides static site hosting for testing and development
- Implement the human interface in HTML, CSS and JavaScript
  - runs browser side

# Required Software

- Text editor
- Web Browser
- Dataset

# Recommended Software

These are additional helpful software you may want to explore later

- [SQLite3](https://sqlite.org)
- [cURL](https://curl.se/download.html)
- [jq](https://jqlang.org)
- [yq](https://mikefarah.gitbook.io/yq)
- [htmlq](https://github.com/mgdm/htmlq)
- [Deno](https://deno.com) for formatting, linting JavaScript and TypeScript

# Installing Dataset (Windows)

- Open a Terminal running Powershell
- Use the following to install Dataset

~~~pswh
irm https://caltechlibrary.github.io/dataset/installer.ps1 | iex
~~~

# Installing Dataset (macOS and Raspberry Pi OS)

- Open a Terminal running Bash or zsh
- Use the following to install Dataset

~~~shell
curl https://caltechlibrary.github.io/dataset/installer.sh | sh
~~~

# Building a light weight metadata repository

- Setting up our Metadata service
- Defining our web service
- Working with client side JavaScript Modules (a.k.a ESM)

# Step 1. Creating our Metadata collection

- Initializing the Metadata collection with `dataset3`
- Creating our htdocs directory

~~~shell
dataset3 init metadata.ds
mkdir htdocs
~~~

# Step 2. Setting up our Metadata service

- Assigning host and port in [metadata_api.yaml](metadata_api.yaml)
- Assigning an htdocs directory
- defining our collections, permissions and queries

# Step 3. Defining the service port, htdocs and collections

~~~yaml
host: localhost:8010
htdocs: htdocs
collections
  - dataset: metadata.ds
~~~

# Step 4. Adding our collection's permissions

~~~yaml
host: localhost:8010
htdocs: htdocs
collections
  - dataset: metadata.ds
    keys: true
    create: true
    read: true
    update: true
    delete: true
~~~

# Step 5. Defining our collection's queries

~~~yaml
host: localhost:8010
htdocs: htdocs
collections:
  - dataset: metadata.ds
    keys: true
    create: true
    read: true
    update: true
    query:
      list_objects: |
        select src
        from metadata
        order by _Key
      list_recent: |
        select src
        from metadata
        order by created desc
        limit ?,?
~~~

# Step 6. Starting up our web service

~~~shell
dataset3d metadata_api.yaml
~~~

You can press Ctrl-C to quit the web service (we'll start it later)

# Step 7. Testing our API

- Creating some test data using [Datatools](https://caltechlibrary.github.io/datatools)
- Or just download the examples [docs/recipes.jsonl](https://caltechlibary.github.io/dataset/docs/recipes.jsonl)
- Testing the API with cURL
- Web forms and the API
- Viewing static side with your web browser

# Step 8. Downloading and load recipes.jsonl

~~~shell
curl https://caltechlibrary.github.io/dataset/docs/recipes.jsonl
dataset3 load metadata.ds <recipes.jsonl
~~~

# Step 9. Testing the API with cURL

In one window start the web service

~~~shell
dataset3d metadata_api.yaml
~~~

Then in another test with cURL

~~~shell
curl http://localhost:8010/api/metadata.ds/keys
curl http://localhost:8010/api/metadata.ds/object/blondie
curl -X POST -d {} http://localhost:8010/api/metadata.ds/query/list_objects
~~~

# Step 10. Building the front end

- Building or index page
- CRUD operations with web forms
- Queries supply lists

# Step 11. Testing our application

- Logged output
- Web Browser development tools

# Conclusion

- Build with the grain of the web
  - the building blocks are HTML, CSS and JavaScript
- Localhost services versus internet services
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
