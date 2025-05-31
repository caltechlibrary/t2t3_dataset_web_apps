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

Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>

# Recipe for an application, Dataset and a Web Component

## Required

### You probably already have this

- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/) (I'm assuming Firefox for this tutorial)

### You'll need to install this

- [Dataset](https://caltechlibrary.github.io/dataset)

NOTE: you need to be comfortable using the terminal application

# Recipe for an application, Dataset and a Web Component

## Suggested

I will use the following to show and test our JSON API.

- [cURL](https://curl.se/docs/manpage.html) (for testing and debugging the JSON API)
- [jq](https://jqlang.org)

# Getting started, what are we creating?

A simple web application that lets us curate a list of recipes.

# Getting started, what are the parts of our application?

1. A web form to adding or edit our recipes
2. A page to display our recipe
2. A way to browse recipes
3. A web service for managing our recipe collection

# Getting started, what is a recipe?

(for purposes of this workshop)

- A unique identifier or "key"
- A name
- A URL if taken from the web
- A list of ingredients and measures (CSV data)
- A description of the preparation process (free format text)

# Getting started, strategy.

1. Mock up using HTML
2. Defining some behaviors
3. Setting up our web service
4. Wire up and improve

NOTE: feed free to enhance the display via CSS in [htdocs/css/styles.css](htdocs/css/styles.css)

# Mock up, what does our metadata look like?

name
: A line of text. Held by an`input` element

url
: A URL. Held by an `input` element of type "url"

ingredients
: A CSV table. Held by a `textarea` or for display a `table`.

procedure
: Free text describing how to prepare the dish. Held by a `textarea` element

We'll need a submit button to save a new or edited recipe.

# Mock up, What about browsing our recipes?

We can use an UL list to list the recipe by name and link to the display page.

Example: [htdocs/index.html](htdocs/index.html)

This is our landing page so it should be named "index.html" in the "htdocs" directory.

We can include mock up sample data view the before setting up our web service by opening the page directly in our web browser.


# Mock up, What would the web form look like?

We can use a single web form for both adding and editing recipes.

Example: [htdocs/edit_recipe.html](htdocs/edit_recipe.html)

This is our edit page so it should be named "edit_recipe.html" in the "htdocs" directory.


# Mock up, What how about displaying our recipe?

We can use an UL list to list the recipe by name and link to the display page.

Example: [htdocs/display_recipe.html](htdocs/display_recipe.html)

This is our display page so it should be named "display_recipe.html" in the "htdocs" directory.


# Behaviors, what actions are needed?

## CRUD-Q

- create a recipe (add)
- retrieve a recipe (display)
- update a recipes (edit)
- delete a recipe (left unimplemented)
- query our collection of recipes (list recipes)


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

# Behaviors, setting up with YAML

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

# Wiring things up, start "recipes_api.yaml"

In your terminal window enter the following command

~~~shell
datasetd recipes_api.yaml
~~~

or the fancy way (make your `recipes_api.yaml` executable, then run it)

~~~shell
chmod 775 recipes_api.yaml
./recipes_api.yaml
~~~

# Wiring things up, checkout the web service with your web browser

Fireup your web browser and try the following links.

- <http://localhost:8001/index.html>
- <http://localhost:8001/display_recipe.html>
- <http://localhost:8001/edit_recipe.html>

# Congratulations, you just implemented your application's web services

**Hurrah!!!**

The web service half of your application is completed.

# Remember your browser has "developer tools", given them a try

- With Firefox look at the "hamburger menu", click "more tools", click "web developer tools"
- Chrome, Safari have different menus, you'll need to find them

# Wiring things up, we use JavaScript and the JSON API to populate our pages

Create our "htdocs" and "htdocs/modules" directories.

~~~shell
mkdir htdocs
mkdir htdocs/modules
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

Here's what [htdocs/list_recipes.js](htdocs/modules/list_recipes.js).


# Wiring things up, No. 2a: "display_recipe.js" behavior

We are going to create a JavaScript "module" caled "display_recipe.js". It's responsibilities are \--

- After page is loaded, get the "key" from the URL paramters
- then retrieve our recipe object from the API
- populate the page and update the navigation (edit element)

NOTE: We have more elements to adjust in the page otherwise the process is very similar to our index.html example.

# Wiring things up, No. 2b: "display_recipe.js" behavior



# Wiring things up, No. 3a: "edit_recipe.js" behaviors

- Needs to handle both "create" and "update"
- Can uses URL path distinguish between "create" and "update"
- For update will need to retrieve the current recipe to edit as JSON, then populate the form
- Will need to handle gathering the form elements and sending them to the JSON API to "create" or "update" the recipe


# Wiring things up, No. 3b: "edit_recipe.js" behaviors

Here's what [htdocs/edit_recipe.js](htdocs/modules/edit_recipe.js).

# Debugging

Work as a group

# Prototype

# Wait but this is ugly!

Yeah, this is only a prototype. Let's iterate on our implementation.

# Improving our application, vanilla CSS

~~~css
/* Example CSS, how minimal can we be? */
~~~

# Improving our application, leveraging web components

We can retrieve the following from [CL-web-components](https://github.com/caltechlibrary/CL-web-components)

- [a_to_z_ul.js]() -> htdocs/modules/a_to_z_ul.js
- [csvtextarea.js]() -> htdocs/modules/csvtextarea.js
- [sortable_table.js]() -> htdocs/modules/sortable_table.js

Now we can update our list, display and web form HTML with these components.

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
