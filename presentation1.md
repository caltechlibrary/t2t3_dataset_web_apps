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

# Dataset and a Web Components

## What we'll do

- We'll build a web application for managing a list of recipes
- Work with HTML, a little JavaScript, JSON and YAML

## What we'll learn

- How to create a JSON API using a simple YAML file and simple SQL SELECT statements
- How to enhance our HTML using Web Compents from [CL Web Components](https://github.com/caltechlibraryCL-web-components)

Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>

# Getting started, requirements

## We'll be used your favor

- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/) (I'm assuming Firefox for this tutorial)

### You'll need to install

- [Dataset](https://caltechlibrary.github.io/dataset)

We can start our first iteration of our applicaiton once you have these available.


## Four parts

1. What are we building, how will we build it?
2. Setting up our web service
3. Creating our static content
4. Enhancements with Web Componts

# Part 1: What are we building?

GOAL: A simple web application that lets us curate a list of recipes.

# Part 1: What are the parts of our application?

1. A web service for managing the recipe collection
2. A way to browse recipes (e.g. list recipes by name)
3. A page to display an individual recipe
4. A web form to adding or edit our recipes

# Part 1: What is a recipe?

- A unique identifier as a "key" (will become part of your URL's path)
- A name
- A list of ingredients and measures (CSV data)
- A procedure describing the preparation process (free format text)

# Part 1: Strategy.

1. Setting up our web service
2. Mockup using HTML
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

# Part 3:Mockup, what does our metadata look like?

name
: A line of text. Held by an`input` element

ingredients
: A CSV table. Held by a `textarea` or for display a `table`.

preparation
: Free text. Held by a `textarea` element

We'll need a submit button to save a new or edited recipe.

# Part 3: What are our web pages?

[htdocs/index.html](htdocs/index.html)
: Display a list of our recipes

[htdocs/display.html](htdocs/display_recipe.html)
: A page that shows the recipe

[htdocs/edit_recipe.html](htdocs/edit_recipe.html)
: A page used to add and edit recipes we've collectioned

# Part 3: populating our pages

We're create four modules, one specific to each HTML page and one utility one that fetches data from our JSON API.

[htdocs/modules/list_recipes.js](htdocs/modules/list_recipes.js)
: Display a list of our recipes

[htdocs/modules/display_recipe.js](htdocs/display_recipe.js)
: A page that shows the recipe

[htdocs/modules/edit_recipe.js](htdocs/modules/edit_recipe.js)
: A page used to add and edit recipes we've collectioned

[htdocs/modules/client_api.js](htdocs/modules/client_api.js)
: This module handles retrieving data from the JSON API. It is "imported" by the three previous modules.

# Mockup, wiring up our pages

- A standard web form that can submit objects to the JSON API
- a JavaScript module used to retrieve objects form the JSON API
- a JavaScript module per page to display the retrieved data

# Behaviors, what actions are needed?

## CRUD-Q

- create a recipe
- retrieve a recipe
- update a recipes
- delete a recipe
- query our collection of recipes

# Behaviors, we can use JavaScript

- retrieve and drop data into our HTML pages
- handle form submission
- to create web components to simplify our HTML and make it more user friendly

# Behaviors, our web service and JSON API provides our data source

- `dataset` sets up our collection 
- `datasetd` provides our web service
- web service is defined using YAML

# Behaviors, create our collection

`dataset` is a command line tool for interacting with collections of JSON documents.

This will create our "recipes.ds" collection.

~~~shell
dataset init recipes.ds
~~~

Populate the collection with some test data, [download recipes.jsonl](recipes.jsonl).

~~~shell
dataset load recipes.ds <recipes.jsonl
~~~


# Wiring things up, checkout the web service with your web browser

Fireup your web browser and try the following links.

- <http://localhost:8001/index.html>
- <http://localhost:8001/display_recipe.html>
- <http://localhost:8001/edit_recipe.html>

# Congradulations, you just implemented your application's web services

**Hurray!!!**

The web service half of your application is completed.

# Remember your browser has "developer tools", given them a try

- With Firefix look at the "hamberger menu", click "more tools", click "web developer tools"
- Chrome, Safari have different menus, you'll need to find them

# Wiring things up, we use JavaScript and the JSON API to populate our pages

Create our "htdocs" and "htdocs/js" directories.

~~~shell
mkdir htdocs
mkdir htdocs/js
~~~

We will be creating the following files.

1. [htdocs/modules/list_recipes.js](htdocs/modules/list_recipes.js)
2. [htdocs/modules/display_recipe.js](htdocs/modules/display_recipe.js)
3. [htdocs/modules/edit_recipes.js](htdocs/modules/edit_recipe.js)

You can download them from <https://github.com/caltechlibrary/t2t3_dataset_web_apps> if you're following along.

# Wiring things up, No. 1a: List our recipes

- Our recipes are provided by our JSON API using the "query" we defined in our "recipe_api.yaml". 
- We can retrieve that using a JavaScript "fetch"
- We can then use the results to populate our index page

# Wiring things up. No. 1b: Our JSON API URL

The query api call requires a POST action. The URL <http://localhost:8001/api/recipes.ds/query/list_recipes>. Here is the brakedown the the URL path.

- `/api`, this indicates to our web service this is an API call
- `/recipes.ds`, indicates the collection we're working with
- `/query`, indicates we running a "query" (remember that from the YAML?)
- `/list_recipes` is the query name to run, parameters would come next if it needed them

# Wiring things up, No. 1c: Testing our JSON API

I use cURL and jq to test the JSON API. cURL provides a easy way to express the HTTP action, GET, POST, PUT, DELETE used in [RESTful](https://en.wikipedia.org/wiki/REST) JSON API.

~~~shell
curl -X POST http://localhost:8001/api/recipes.ds/query/list_recipes | jq .
~~~

# Wiring things up, No. 1d: Creating list_recipes.js, using "fetch"

We are going to create a JavaScript "module" caled "list_recipes.js". It's responsibilities are \--

- After page is loaded, get the elem holding our UL list ("recipe-list")
- then retrieve our list of recipes from the API
- populate the UL list using the retrieved object

See "modules" at [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

NOTE: The script element should be of type "module".

# Wiring things up. No. 1e: 

Here's what [list_recipes.js](htdocs/modules/list_recipes.js) looks like.

~~~javascript
/**
 * list_recipes.js is a module that uses the Dataset JSON API for recipes_api.yaml to list
 * the recipes in the recipes.ds collection.
 */


/**
 * retrieveRecipesFromAPI shows the basic way to use "fetch" to retrieve results from 
 * the query endpoint of the JSON API provided by dastasetd.
 */
async function retrieveRecipesFromAPI() {
  const apiURL = "http://localhost:8001/api/recipes.ds/query/list_recipes";
  const method = "POST";

  const response = await fetch(apiURL, { method: method });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

/**
 * populateUL takes the results of the JSON API query and renders the LI for the UL list
 */
function populateUL(ul, data) {
    ul.innerHTML = "";
    for (const obj of data) {
      if (
        obj.key !== undefined && obj.key !== "" && obj.name !== undefined &&
        obj.name !== ""
      ) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        console.log(`DEBUG key: ${obj.key} -> ${obj.name}`);
        a.href = `display_recipe.html?key=${obj.key}`;
        a.innerHTML = obj.name;
        console.log(a);
        li.appendChild(a);
        ul.appendChild(li);
      }
    }
}

/**
 * listRecipes contacts the JSON API and populates the URL list identified using the id "recipe_list".
 */
async function listRecipes() {
    const ul = document.getElementById("recipe-list");
    // Clear our UL list
    ul.innerHTML = "";
    // Get our list
    const data = await retrieveRecipesFromAPI();
    // Now populate it with "data"
    populateUL(ul, data);
}

/**
 * Wait until the page is loaded before updating.
 */
document.addEventListener("DOMContentLoaded",  await listRecipes());
~~~

# Wiring things up, No. 2a: "display_recipe.js" behavior

We are going to create a JavaScript "module" caled "display_recipe.js". It's responsibilities are \--

- After page is loaded, get the "key" from the URL paramters
- then retrieve our recipe object from the API
- populate the page and update the navigation (edit element)

NOTE: We have more elements to adjust in the page otherwise the process is very similar to our index.html example.

# Wiring things up, No. 2b: "display_recipe.js" behavior

Here's what [display_recipes.js](htdocs/modules/display_recipe.js) looks like.

~~~JavaScript
~~~


# Wiring things up, No. 3: "edit_recipe.js" behaviors

- Needs to handle both "create" and "update"
- Can uses URL path distinguish between "create" and "update"
- For update will need to retrieve the current recipe to edit as JSON, then populate the form
- Will need to handle gathering the form elements and sending them to the JSON API to "create" or "update" the recipe


# Wiring things up, No. 3: "edit_recipe.js" behaviors

- Needs to handle both "create" and "update"
- Can uses URL path distinguish between "create" and "update"
- For update will need to retrieve the current recipe to edit as JSON, then populate the form
- Will need to handle gathering the form elements and sending them to the JSON API to "create" or "update" the recipe

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

- [a_to_z_ul.js]() -> htdocs/modules/a_to_z_ul.js
- [csvtextarea.js]() -> htdocs/modules/csvtextarea.js
- [sortable_table.js]() -> htdocs/modules/sortable_table.js




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
