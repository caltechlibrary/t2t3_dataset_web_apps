---
title: "A recipe for applications: Dataset & Web Components"
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
institute: |
  Caltech Library,
  Digital Library Development
description: T2T3 presentation
urlcolor: blue
linkstyle: bold
aspectratio: 169
createDate: 2025-05-29
updateDate: 2025-06-04
draft: true
pubDate: TBD
place: Caltech
date: TBD
section-titles: false
toc: true
keywords: [ "Dataset", "HTML", "CSS", "JavaScript", "Web Components" ]
url: "https://caltechlibrary.github.io/t2t3_dataset_web_app/presentation1.html"
---

# Welcome to "A recipe for applications"

Welcome everyone. This is a talk and hands on workshop.

> An approach to building web applications using Dataset and Web Components

# Workshop: Dataset & Web Components

## What we'll do

- We'll build a web application for managing a list of recipes
- Work with HTML, a little JavaScript, JSON and YAML

## What we'll learn

- How to create a JSON API using a YAML file and an embedded SQL SELECT statement
- How to enhance our HTML using Web Components from [CL Web Components](https://github.com/caltechlibraryCL-web-components)

Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>

Download the presentation zip file at <https://github.com/caltechlibrary/t2t3_dataset_web_apps/releases>

# Getting started

### You probably already have these, if not install them

- A computer running macOS, Lunix, Raspberry Pi OS, Windows
- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/) (I'm assuming Firefox for this tutorial)

### Install dataset

- See <https://caltechlibrary.github.io/dataset/INSTALL.html>
  - If you have problems you can download the zip files from here <https://github.com/caltechlibrary/dataset/releases>
- You need to be running the latest v2 release (>= 2.2.7)

We can start our first iteration of our application once you have these available.

# Part 1: What are we building?

GOAL: A simple web application that lets us curate a list of recipes.

We're going start from the backend and spend most of our time on the front end.

# Part 1.1: What are the parts of our application?

1. A web service for managing the recipe collection
2. A page to browse recipes by name
3. A page to display a recipe
4. A page and web form to add or edit a recipe

# Part 1.1: What is a recipe?

- A "key", the unique identifier of a recipe (url friendly)
- A name (human friendly and readable)
- A list of ingredients and measures (CSV data)
- A procedure describing the preparation process (text)

# Part 1.1: Basic Strategy

1. Setting up our web service
2. Sketch your app using HTML
3. Wire up and test

# Part 1.2: Setting up our web service

1. create our `recipes.ds` collection
2. load sample data into our `recipes.ds` collection
3. Configure and run our collection as a web service

# Part 1.2: creating our collection

We use the `dataset` command line program to initialize a dataset collection.

~~~shell
dataset init recipes.ds
~~~

(Linux, macOS and Windows)

# Part 1.2: Loading some sample data

Download sample data file [recipes.jsonl](recipes.jsonl) 
(see: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/recipes.jsonl>)

~~~shell
cat recipes.jsonl | dataset load recipes.ds
~~~

On Windows:

~~~pwsh
type recipes.jsonl | dataset load recipes.ds
~~~

# Part 1.2: Verify we loaded our data OK

~~~shell
dataset keys recipes.ds
dataset read recipes.ds frybread
~~~

# Part 1.2: Example terminal interaction

~~~shell
$ dataset keys recipes.ds
blondies
brownies
cafe-con-leche
frybread
poi
waffles
~~~

# Part 1.2: Example terminal interaction

~~~shell
$ dataset read recipes.ds frybread
{
    "ingredients": "backing powder,2 tsp\r\nflour,2 cups\r\nhot water,2/3 cups\r\nsalt,1 tsp salt\r\nshortening,2 Tbsp\r\n",
    "key": "frybread",
    "name": "Fry Bread",
    "procedure": "1. Combine flour, baking powder, and salt in a bowl.\r\n2. Use a pastry blender (or two butter knives) to cut the shortening into the flour.\r\n3. Add the hot water, and mix until the water is incorporated and you get a dough.\r\n4. Turn out the dough on a lightly floured board. Knead the dough until it is soft and smooth.\r\n5. Wrap the dough in plastic, and let the dough rest for 30 minutes.\r\n6. Divide the dough into 6 pieces, roll each into a ball, and roll each into a flat disk with a rolling pin.\r\n7. Brush one side of each disk with melted margarine and place on a barbecue over a 3 Mississippi fire.\r\n8. Brush the opposing side of the bread with margarine and flip the bread on the barbecue.\r\n9. Cook until both sides are golden brown. Serve hot.\r\n\r\n- You can substitute either 1/4 cup plain yogurt, or a 1/4 cup soured milk as a leavening agent\r\ninstead of baking powder. If you do, add 2 hours to the rest time for the dough, and leave\r\nthe dough somewhere warm. You can optionally include the baking powder as well to get a\r\nvery puffy version of frybread. If using yogurt or soured milk for leavening, use 1\2 cup\r\ninstead of 1/3 cup water.\r\n- You can use mayonnaise in place of shortening for a crispy, crunchier texture.\r\n- You can also fry the dough in hot oil over a stovetop. The dough cooks rapidly and will brown\r\nin about 12 seconds and must be turned over to allow the opposite side to brown, then be removed\r\nfrom the oil and placed sideways into a colander or large bowl lined with paper towels to allow\r\nthe oil to drain off the finished product\r\n\r\nurl: https://en.wikibooks.org/wiki/Cookbook:Fry_Bread_I\r\n"
}
~~~

# Part 1.2: create the static content directories

~~~shell
mkdir htdocs
mkdir htdocs/modules
mkdir htdocs/css
~~~

# Part 1.2: Setting up our web service

`datasetd` provides a turn key web service defined by a simple YAML file. It can host
one or more dataset collections. It provides a static file service as well as a JSON API
for each collection. 

Create the file [recipes_api.yaml](recipes_api.yaml)
(see: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/recipes_api.yaml>).

# Part 1.2: recipes_api.yaml

~~~yaml
#!/usr/bin/env -S datasetd -debug
host: localhost:8001
htdocs: htdocs
collections:
  - dataset: recipes.ds
    keys: true
    create: true
    # When we successfully create (or update via a POST) an object display it
    create_success: display_recipe.html
    # When we fail go back to the current page.
    create_error: edit_recipe.html
    read: true
    update: true
    delete: true
    query:
      list_recipes: |
        select src
        from recipes
        order by src->>'name'
~~~

# Part 1.2: Starting and stopping the web service

Starting the web service.

~~~shell
datasetd -debug recipes_api.yaml
~~~

- Go do <http://localhost:8001/api/version>
- Look at the terminal window, do you see the log message for the request?
- You can shutdown the service by press control and C (Ctrl-C) in the terminal session

# Part 1.2: Starting and stopping the web service

- Tired to typing `datasetd -debug recipes_api.yaml`?
- Make the YAML file executable!

(on macOS, Linux or Window's WSL)

~~~shell
chmod 775 recipes_api.yaml
~~~

Now you can shorten start up to

~~~shell
./recipes_api.yaml
~~~

# Part 1.3: What about our static content?

The web service is running but haven't populated the htdocs directory.

What do you see when you go to <http://localhost:8001/>? 

# Part 1.3: What should our recipe metadata look like?

key
: A unique identifier for the recipe (needed by dataset to distinguish objects).

name
: A line of text. Held by an`input` element

ingredients
: A CSV table. Held by a `textarea` or for display a `table`.

procedure
: Free text describing how to prepare the dish. Held by a `textarea` element

We'll need a submit button to save a new or edited recipe.

# Part 1.3: What are our web pages?

[htdocs/index.html](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/index.html)
: Display a list of our recipes

[htdocs/display_recipe.html](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/display_recipe.html)
: A page that shows the recipe

[htdocs/edit_recipe.html](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/edit_recipe.html)
: A page used to add and edit recipes we've collected

# Part 1.3: Populating our pages using JavaScript

We'll create four modules, one specific to each HTML page and one utility module

[htdocs/modules/list_recipes.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/modules/list_recipes.js)
: Display a list of our recipes

[htdocs/modules/display_recipe.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/modules/display_recipe.js)
: A page that shows the recipe

[htdocs/modules/edit_recipe.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/modules/edit_recipe.js)
: A page used to add and edit recipes we've collected

[htdocs/modules/utils.js](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs/modules/utils.js)
: This module handles retrieving data from the JSON API and finding the object's key

# Part 1.3: Fire up our web service

In a terminal run our startup command 

~~~shell
datasetd -debug recipes_api.yaml
~~~

# Part 1.3: Test using your web browser

1. Go to <http://localhost:8001>
2. In your browser turn on your developer tools
3. Reload the page and explore using your developer tools
4. Click through the site

# Part 1.3: Debugging and improving

1. Are there issues to debug?
2. What happens when you add a recipe?
3. What happens when you hen you update a receipt?
4. Can any of this be improved?

# Intermission

Let's take a short break then we'll comeback and iterate.

I'm available for questions.

# Part 2:  Recipes version 2

What we are doing next

- Creating a new dataset collection called, `recipes2.ds`
- Creating a new, `recipes_api2.yaml`
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

- Handle form submission sends us to a useless URL, how do we fix that?
- Typing in comma seperated values is cumbersum, can me improve that?

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

# Part 3: My Recomendations

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
  - Trade off: individual compontents can be complex
- REST services force us to middleware or Browser JavaScript
  - Is it reasonable to require JavaScript (or WASM)?
  - Is there a simpler abstraction?

# Reference: Dataset

- [Dataset Project](https://caltechlibrary.github.io/dataset)
- [Dataset Repostitory](https://github.com/caltechlibrary/dataset)
- [Getting help with Dataset](https://github.com/caltechlibrary/dataset/issues)

# Reference: CL-web-components

[CSVTextarea](https://github.com/caltechlibrary/CL-web-components/blob/main/csvtextarea.js)
: Wraps a textarea element and presents a editable table of cells

[AToZUL](https://github.com/caltechlibrary/CL-web-components/blob/main/a_to_z_ul.js)
: Wraps a UL list and creates an A to Z list

[SortableTable](https://github.com/caltechlibrary/CL-web-components/blob/main/sortable_table.js)
: Wraps an HTML table making it sort-able and filterable on a column

- Getting help with CL-web-components, <https://github.com/caltechlibrary/CL-web-components/issues>.

# Reference: Programming Languages

- [HTML5](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content), structured content
- [CSS](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics), layout and style
- [JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting), behaviors and web components
- [SQL and SQLite](https://sqlite.org)
  - [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [MDN](https://developer.mozilla.org/en-US)

# Reference: Data formats

- [JSON](https://www.json.org)
- [JSON Lines](https://jsonlines.org)
- [YAML](https://yaml.org/)

# Thank you for listening

- View presentation: <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>
- View the repository: <https://github.com/caltechlibrary/t2t3_dataset_web_apps>
- Comment on this spresentation: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>
- Author: R. S. Doiel, <mailto:rsdoiel@caltech.edu>
