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
url: "https://caltechlibrary.github.io/t2t3_dataset_web_app/presentation1.html"
---

# Welcome to Dataset and a Web Components

- Dataset provides a turn key web static service and JSON API
- Extending HTML elements using Web Components

## What we'll do

- We'll build a web application for managing a list of recipes
- Work with HTML, a little JavaScript, JSON and YAML

## What we'll learn

- How to create a JSON API using a YAML file and an embedded SQL SELECT statement
- How to enhance our HTML using Web Components from [CL Web Components](https://github.com/caltechlibraryCL-web-components)

Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>

You can download the presentation in a zip file at <https://github.com/caltechlibrary/t2t3_dataset_web_apps/releases>

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

# Part 1.1: What are the parts of our application?

1. A web service for managing the recipe collection
2. A way to browse recipes by name
3. A page to display a recipe
4. A web form for adding or edit our recipes

# Part 1.1: What is a recipe?

- A "key", the unique identifier of a recipe
- A name
- A list of ingredients and measures (CSV data)
- A procedure describing the preparation process (text)

# Part 1.1: Strategy

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

# Part 1.2: Loading some sample data

We can now load some sample data, download [recipes.jsonl](recipes.jsonl) 
(see: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/recipes.jsonl>)

on macOS or Linux

~~~shell
dataset load recipes.ds <recipes.jsonl
~~~

or Windows

~~~shell
type recipes.jsonl | dataset load recipes.ds
~~~

# Part 1.2: Verify we loaded our data OK

On macOS, Linux or windows

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
    "ingredients": "backing powder,2 tsp\r\nflour,2 cups\r\nhot water,⅔ cups\r\nsalt,1 tsp salt\r\nshortening,2 Tbsp\r\n",
    "key": "frybread",
    "name": "Fry Bread",
    "procedure": "1. Combine flour, baking powder, and salt in a bowl.\r\n2. Use a pastry blender (or two butter knives) to cut the shortening into the flour.\r\n3. Add the hot water, and mix until the water is incorporated and you get a dough.\r\n4. Turn out the dough on a lightly floured board. Knead the dough until it is soft and smooth.\r\n5. Wrap the dough in plastic, and let the dough rest for 30 minutes.\r\n6. Divide the dough into 6 pieces, roll each into a ball, and roll each into a flat disk with a rolling pin.\r\n7. Brush one side of each disk with melted margarine and place on a barbecue over a 3 Mississippi fire.\r\n8. Brush the opposing side of the bread with margarine and flip the bread on the barbecue.\r\n9. Cook until both sides are golden brown. Serve hot.\r\n\r\n- You can substitute either ¼ cup plain yogurt, or a ¼ cup soured milk as a leavening agent\r\ninstead of baking powder. If you do, add 2 hours to the rest time for the dough, and leave\r\nthe dough somewhere warm. You can optionally include the baking powder as well to get a\r\nvery puffy version of frybread. If using yogurt or soured milk for leavening, use ½ cup\r\ninstead of ⅓ cup water.\r\n- You can use mayonnaise in place of shortening for a crispy, crunchier texture.\r\n- You can also fry the dough in hot oil over a stovetop. The dough cooks rapidly and will brown\r\nin about 12 seconds and must be turned over to allow the opposite side to brown, then be removed\r\nfrom the oil and placed sideways into a colander or large bowl lined with paper towels to allow\r\nthe oil to drain off the finished product\r\n\r\nurl: https://en.wikibooks.org/wiki/Cookbook:Fry_Bread_I\r\n",
    "save": ""
}
~~~

# Part 1.2: create an static content directory directory

~~~shell
mkdir htdocs
mkdir htdocs/modules
mkdir htdocs/css
~~~

# Part 1.2: Checking the layout with tree

~~~shell
$ tree htdocs
htdocs
├── css
└── modules

3 directories, 0 files
~~~

# Part 1.2: Setting up our web service, configuring the web service

`datasetd` provides a turn key web service defined by a simple YAML file. It can host
one or more dataset collections. It provides a static file service as well as a JSON API
for each collection. Let's call this [recipes_api.yaml](recipes_api.yaml)
(see: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/recipes_api.yaml>).

# Part 1.2: Setting up our web service, configuring the web service

~~~yaml
#!/usr/bin/env -S datasetd -debug
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

# Part 1.2: Starting and stopping the web service

Starting the web service.

~~~shell
datasetd recipes_api.yaml
~~~

- Go do <http://localhost:8001/api/version>
- Look at the terminal window, do you see the log message for the request?
- You can shutdown the service by press control and C (Ctrl-C) in the terminal session

# Part 1.3: Creating our static content

The web service is running but haven't populated the htdocs directory. What do you see when you go to <http://localhost:8001/>? 

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

# Part 1.3: populating our pages

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
datasetd recipes_api.yaml
~~~

# Part 1.3: Test using your web browser

1. Go to <http://localhost:8001>
2. In your browser open your "developer tools"
3. Reload the page and monitor the loads
4. Click through the website

# Part 1.3: Debugging and improving

1. There will be issues you need to debug
2. What happens when you add a recipe?
3. What happens when you hen you update a receipt?
4. Can any of this be improved?

# Intermission

Let's take a short break then we'll comeback and iterate.

I'm available for questions.

# Part 2

We're going to set aside the prototype remembering what did and didn't work. 

# Part 2.2: Iterating, Recipes 2

What we are doing next

- Creating a new dataset collection called, `recipes2.ds`
- Creating a new, `recipes_api2.yaml`
- Creating a new directory structure for our static content called, `htdocs2`

# Part 2.2: Iterating, Recipes 2

On macOS and Linux 

~~~shell
dataset init recipes2.ds
cp recipes_api.yaml recipes_api2.yaml
cp -vR htdocs htdocs2
~~~

on Windows

~~~shell
dataset init recipes2.ds
copy recipes_api.yaml recipes_api2.yaml
copy -Recurse htdocs htdocs2
~~~

(NOTE: The first line should look familiar, the others are just time savers)

# Part 2.2: Updating our YAML configuration

- edit our [recipes_api2.yaml](https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/recipes_api2.yaml)
- update the `htdocs` reference
- update the port number in hosts to 8002
- update the dataset to `recipes2.ds`
- What additional files need to change?
  - did we hard code the collection name in HTML?
  - did we hard code the collection name in JavaScript?

# Part 2.2: Testing a new instance

1. Test our new instance
  a. what is broken?
  b. Did we catch all the places with hard coded collection names?
  c. What about behaviors?
2. Shutdown down and restart datasetd to debug YAML changes

~~~shell
dataset recipes_api2.yaml
~~~

# Part 2.2: Desirable changes

- Handle form submission sends us to a useless URL, how do we fix that?
- Hand entering CSV is cumbersum, can me improve that?

# Part 2.2: Fixing the form submission

- The `utils.js` module includes a `saveRecipe` function
- We need an event listener to trigger, what event? which element?

# Part 2.3: Anatomy of our saveRecipe

1. Retrieve the data from the web form
2. Use fetch to send the data and receive a response
3. Based on the response decide where to go

# Part 2.3: Improving the UI with Web Components

1. Extend the HTML elements available
2. Implement components as JavaScript Modules

# Part 2.3: CL-web-components

- CL-web-components, a collection of web components designed for Caltech Library
- Use your web browser retrieve the latest release

<https://github.com/caltechlibrary/CL-web-components/releases>


# Part 2.3: Copy the web components to the modules directory (macOS, Linux)

- Unzip just the JavaScript files
- Copy the JavaScript files in the zip file to `htdocs2/modules/`.

Linux, macOS

~~~shell
unzip $HOME/Downloads/cl-web-components-0.0.6.zip *.js
mv -v *.js htdocs2/models/
~~~

# Part 2.3: Copy the web components to the modules directory (Windows)

- Unzip just the JavaScript files
- Copy the JavaScript files in the zip file to `htdocs2/modules/`.

Linux, macOS

~~~shell
unzip $HOME\Downloads\cl-web-components-0.0.6.zip *.js
move *.js htdocs2\models\
~~~

# Part 2.2: Adding CSVTextarea to edit_recipe.html

- edit `htdocs2/edit_recipe.html` to include the CSVTextarea module in the document head
- edit `htdocs2/edit_recipe.html` wrapping the "ingredients" textarea with `<csv-textarea>`

See: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/blob/main/htdocs2/edit_recipe.html>

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

# Part 3: Exploring further

- [MDN](https://developer.mozilla.org/en-US)
- LLMs, including ones you can run locally via Ollama

# Part 3: What we've covered and some questions

- The server side can be turn key using a JavaScript web page
  - What is it a good idea?
  - When is be an bad idea?
- Moving from a single layer stack to a two or three layer stack
  - Dataset behind a front end web server
  - Dataset behind middle ware

# Part 3: What we've covered and some questions

- The traditional division of responsibilities in the browser is
  - HTML for structured data markup
  - CSS for visual design and layout
  - JavaScript to orchestrate behaviors
- Why bother with Web Components?

# Part 3: Misc thoughts

- Progressive enhancement is still relevant in 2025
- Web Components offer the possibility of consistent rich behaviors across
  websites and web applications (bonus they can be used to to ensure accessibility)
- There are still times you want to write custom middle ware, example COLD

# Conclusion

- Build with the grain of the web
  - the building blocks are HTML, CSS and JavaScript
  - take advantage of running software on localhost
- Production, build in layers
  - access control with front end web service (Apache+Shibboleth, NginX+Shibboleth)
  - data validation with middle ware (localhost: TypeScript or Python)
  - object storage with Dataset (localhost)

# Reference: Dataset

- [Dataset Project](https://caltechlibrary.github.io/dataset)

# Reference: CL-web-components

[CSVTextarea](https://github.com/caltechlibrary/CL-web-components/blob/main/csvtextarea.js)
: Wraps a textarea element and presents a editable table of cells

[AToZUL](https://github.com/caltechlibrary/CL-web-components/blob/main/a_to_z_ul.js)
: Wraps a UL list and creates an A to Z list

[SortableTable](https://github.com/caltechlibrary/CL-web-components/blob/main/sortable_table.js)
: Wraps an HTML table making it sort-able and filterable on a column

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
