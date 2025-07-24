---
title: "A recipe for applications: Dataset & Web Components"
author: "R. S. Doiel, <rsdoiel@caltech.edu>"
abstract: |
  This is an overview of using Dataset to quickly bill web applications
  using basic web building blocks (HTML, JavaScript) and YAML.
institute: |
  Caltech Library,
  Digital Library Development
description: workshop presentation
slidy-url: .
css: styles/sea-and-shore.css
createDate: 2025-05-29
updateDate: 2025-06-27
draft: true
pubDate: 2025-06-12
place: Caltech Library (Zoom)
date: 2025-06-12
section-titles: false
toc: true
keywords: [ "Dataset", "HTML", "JavaScript", "Web Components" ]
url: "https://caltechlibrary.github.io/t2t3_dataset_web_app/presentation1.html"
---

# Welcome to "A recipe for applications"

Welcome everyone. This is a hands on workshop (part 1).

> An approach to building web applications using Dataset

# Workshop: Dataset & HTML

## What we'll do

- We'll build a web application for managing a list of recipes
- Work with HTML, a little JavaScript, JSON and YAML

# Workshop: Dataset & HTML

## What we'll learn

- How to create a JSON API using a YAML file and an embedded SQL SELECT statement
- How to use HTML and a little JavaScript browser to turn the API into an application

Follow along at <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>

Download the presentation zip file at <https://github.com/caltechlibrary/t2t3_dataset_web_apps/releases>

# Getting started

### You probably already have these, if not install them

- A computer running macOS, Linux, Raspberry Pi OS, Windows
- Terminal application
- [Text Editor](https://vscodium.com/)
- [Web Browser](https://www.mozilla.org/en-US/firefox/new/) (I'm assuming Firefox for this tutorial)
- [cURL](https://curl.se/) (macOS/Linux) or [irm](https://learn.microsoft.com/en-us/powershell/module/?term=irm) (Windows)

# Getting started

### Install dataset

- See <https://caltechlibrary.github.io/dataset/INSTALL.html>
  - If you have problems you can download the zip files from here <https://github.com/caltechlibrary/dataset/releases>
- You need to be running the latest v2 release (>= 2.3.2)

NOTE: [INSTALL NOTES macOS](https://caltechlibrary.github.io/dataset/INSTALL_NOTES_macOS.html) & [INSTALL NOTES Windows](https://caltechlibrary.github.io/dataset/INSTALL_NOTES_Windows.html)

We can start our first iteration of our application once you have these available.


# Wait, what is Dataset?

## Short answer

- A collection of tools for curating JSON objects as collections

# Wait, what is Dataset?

## Long answer

- A way of managing collections of JSON documents
  - A JSON document expresses an object, e.g. a metadata record
- Dataset manages objects using key object pairs
- The JSON objects can be queried using SQL
- Collections are flexible (schema-less)

# Part 1: What are we building?

GOAL: A simple web application that lets us curate a list of recipes.

- Start with the web service (back end)
- Finish with the browser  (front end, browser side)

# Part 1.1: What are the parts of our application?

1. A web service for managing the recipe collection
2. A page to browse recipes by name
3. A page to display a recipe
4. A page with a web form to add or edit a recipe

# Part 1.1: What is a recipe? (it's data structure)

- A "key", the unique identifier of a recipe (url friendly)
- A name (human friendly and readable)
- A list of ingredients and their quantities (CSV data)
- A procedure describing the preparation process (text)

# Part 1.1: Basic Strategy

1. Setting up a collection
2. Setting up our web service
3. Sketch our app using HTML
4. Wire up and test

# Part 1.2: Setting up our collection

1. create our `recipes.ds` collection
2. load sample data into our `recipes.ds` collection
3. Configure and run our collection web service

# Part 1.2: creating our collection

We use the `dataset` command line program to initialize a dataset collection.

~~~shell
dataset init recipes.ds
~~~

(Linux, macOS and Windows)

# Part 1.2: Sample Data, it's nice to have

- When prototyping applications it's nice to have data to work with
- I've created some for our recipe application
- Dataset supports ingesting collections using JSON line documents

# Part 1.2: What is JSON Lines?

- Sometimes called JSON-L, JSONL, file extension `.jsonl`
- One JSON object per line, see <https://jsonlines.org/>
- A portable way to express object collections
  - supported by dataset's dump and load actions

# Part 1.2: Loading some sample data

Download sample data file [recipes.jsonl](recipes.jsonl) 

~~~shell
curl -o recipes.jsonl \
  https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/recipes.jsonl
cat recipes.jsonl | dataset load recipes.ds
~~~

On Windows:

~~~pwsh
irm -OutFile recipes.jsonl `
  https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/recipes.jsonl
Get-Content recipes.jsonl | dataset load recipes.ds
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
    "procedure": "1. Combine flour, baking powder, and salt in a bowl.\r\n2. Use a pastry blender (or two butter knives) to cut the shortening into the flour.\r\n3. Add the hot water, and mix until the water is incorporated and you get a dough.\r\n4. Turn out the dough on a lightly floured board. Knead the dough until it is soft and smooth.\r\n5. Wrap the dough in plastic, and let the dough rest for 30 minutes.\r\n6. Divide the dough into 6 pieces, roll each into a ball, and roll each into a flat disk with a rolling pin.\r\n7. Brush one side of each disk with melted margarine and place on a barbecue over a 3 Mississippi fire.\r\n8. Brush the opposing side of the bread with margarine and flip the bread on the barbecue.\r\n9. Cook until both sides are golden brown. Serve hot.\r\n\r\n- You can substitute either 1/4 cup plain yogurt, or a 1/4 cup soured milk as a leavening agent\r\ninstead of baking powder. If you do, add 2 hours to the rest time for the dough, and leave\r\nthe dough somewhere warm. You can optionally include the baking powder as well to get a\r\nvery puffy version of frybread. If using yogurt or soured milk for leavening, use 1\2 cup\r\ninstead of 1/3 cup water.\r\n- You can use mayonnaise in place of shortening for a crispy, crunchier texture.\r\n- You can also fry the dough in hot oil over a stove top. The dough cooks rapidly and will brown\r\nin about 12 seconds and must be turned over to allow the opposite side to brown, then be removed\r\nfrom the oil and placed sideways into a colander or large bowl lined with paper towels to allow\r\nthe oil to drain off the finished product\r\n\r\nurl: https://en.wikibooks.org/wiki/Cookbook:Fry_Bread_I\r\n"
}
~~~

# Part 1.2: Setting up our web service

1. Create our static content directories
2. Define our web service using a YAML file

# Part 1.2: create the static content directories

~~~shell
mkdir htdocs
mkdir htdocs/css
mkdir htdocs/modules
~~~

# Part 1.2: Dataset stores our objects, how does that help?

- The Dataset project provides a web service called `datasetd`
- This web service provides a [REST](https://en.wikipedia.org/wiki/REST) JSON API for one or more dataset collections
- Dataset web service can provide static content hosting
- These two features implement a "back end" for a web application

# Part 1.2: Setting up our web service

`datasetd` web service is defined by a simple YAML file. It has three top level attributes

- host (required)
- htdocs (optional)
- collections (optional)

NOTE: Dataset web service can host many collections at the same time.

# Part 1.2: We need to create our YAML configuration file

YAML is a superset of JSON that is easy to read and easy to type.

1. Create a file, using your text editor called [recipes_api.yaml](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/recipes_api1.yaml)
2. Type in `host: localhost:8001`

~~~yaml
host: localhost:8001
~~~

This line tells dataset web service that it should listen on port 8001 on localhost.
Dataset web services always run on localhost.

# Part 1.2: We need to create our YAML configuration file

Since we are going to build a web application we need to tell the Dataset web service where to find
our static content. This is done using the `htdocs` attribute. Relative paths are assumed to start
at the same directory level as our YAML file. Add our htdocs line based on the directory structure we 
created earlier.

~~~yaml
host: localhost:8001
htdocs: htdocs
~~~

# Part 1.2: We need to create our YAML configuration file

The next element, `collections` lets us define a list of one or more dataset collections that are available
from our web service. For our project we define just one. Our collection is called, `recipes.ds`.

~~~yaml
host: localhost:8001
htdocs: htdocs
collections:
  - dataset: recipes
~~~

# Part 1.2: We need to create our YAML configuration file

We now have a minimal configuration. But right now it is not useful. For each collection we need to define
the access (at the collection level) needed by our web application. The access is modeled on the core actions
available in the dataset command line tool.

- keys (allow retrieval of keys)
- create (allow objects to be added to a collection)
- update (allow objects in a collection to be updated)
- delete (allow objects to be deleted)

If an permission is not included it is defaults to false. The value true will enabled it.

# Part 1.2: We need to create our YAML configuration file

Here's what the permissions look like for our web application.

~~~yaml
host: localhost:8001
htdocs: htdocs
collections:
  - dataset: recipes
    keys: true
    create: true
    update: true
    delete: false
~~~

# Part 1.2: We need to create our YAML configuration file

SQL is a powerful language. Dataset only allows defined queries to be run. One simple query is needed for our application, `index_recipes`.

~~~yaml
host: localhost:8001
htdocs: htdocs
collections:
  - dataset: recipes
    keys: true
    create: true
    update: true
    delete: false
    query:
       list_recipes: |
        select src
        from recipes
        order by src->>'name'
~~~

# Part 1.2: REST and the browser

- The dataset web service is a REST JSON API
- Browsers do not support REST in HTML (only GET and POST)

# Part 1.2: REST and the browser

- Dataset web service overloads POST to subsume PUT actions of REST 
- Dataset web service supports success and error redirects for POST

~~~yaml
host: localhost:8001
htdocs: htdocs
collections:
  - dataset: recipes
    keys: true
    create: true
    # Create redirectos do double duty as a POST also supports update.
    create_success: http://localhost:8001/display_recipe.html
    create_error: http://localhost:8001/edit_recipe.html
    update: true
    delete: false
    query:
      list_recipes: |
        select src
        from recipes
        order by src->>'name'
~~~


# Part 1.2: recipes_api.yaml

YAML allows comments, here's an example.

~~~yaml
#!/usr/bin/env -S datasetd -debug
# Host and port to listen on
host: localhost:8001
# location of our static content
htdocs: htdocs
# Define the collections supported in our application
collections:
  # Define the permissions and behavior of the API For our recipe collection
  - dataset: recipes.ds
    keys: true
    create: true
    # When we successfully create or update via a form using a POST method
    # display the updated object
    create_success: http://localhost:8001/display_recipe.html
    # When we fail go back to the current page.
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

# Part 1.2: recipes_api.yaml

On macOS and Linux you can cURL the `recipes_api.yaml` using the following statement.

~~~shell
curl -o recipes_api.yaml \
   https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/recipes_api1.yaml
~~~

On Windows

~~~pwsh
irm -OutFile recipes_api.yaml `
   https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/recipes_api1.yaml
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

- Tired to typing "`datasetd -debug recipes_api.yaml`"?
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

The web service is running but the htdocs directory is not populated.

What do you see when you go to <http://localhost:8001/>? 

We can complete our application by building the front end with HTML, CSS and JavaScript.

# Part 1.3: What should our recipe metadata look like?

key
: A unique identifier for the recipe (needed by dataset to distinguish objects).

name
: A line of text. Held by an `input` element

ingredients
: A CSV table. Held by a `textarea` or for display a `table`.

procedure
: Free text describing how to prepare the dish. Held by a `textarea` element

We'll need a submit button to save a new or edited recipe.

# Part 1.3: What are our web pages?

[htdocs/index.html](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs1/index.html "you may retrieve the contents via curl or irm")
: Display a list of our recipes


[htdocs/display_recipe.html](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main//htdocs1/display_recipe.html "you may retrieve the contents via curl or irm")
: A page that shows the recipe

[htdocs/edit_recipe.html](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main//htdocs1/edit_recipe.html "you may retrieve the contents via curl or irm")
: A page used to add and edit recipes we've collected

# Part 1.3: Populating our pages using JavaScript

We'll create four modules, one specific to each HTML page and one utility module

[htdocs/modules/index_recipes.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs1/modules/index_recipes.js "you may retrieve the contents via curl or irm")
: Display a list of our recipes

[htdocs/modules/display_recipe.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main//htdocs1/modules/display_recipe.js "you may retrieve the contents via curl or irm")
: A page that shows the recipe

[htdocs/modules/edit_recipe.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main//htdocs1/modules/edit_recipe.js "you may retrieve the contents via curl or irm")
: A page used to add and edit recipes we've collected

[htdocs/modules/utils.js](https://raw.githubusercontent.com/caltechlibrary/t2t3_dataset_web_apps/refs/heads/main/htdocs1/modules/utils.js "you may retrieve the contents via curl or irm")
: This module handles retrieving data from the JSON API and finding the object's key

# Part 1.3: Fire up our web service

In a terminal run our startup command 

~~~shell
datasetd -debug recipes_api.yaml
~~~

# Part 1.3: Test using your web browser

1. Go to <http://localhost:8001>
2. In your browser turn on your developer tools
3. Reload the page
4. Explore while your developer tools are turned on

# Part 1.3: Debugging and improving

1. Are there issues to debug?
2. What happens when you add a recipe?
3. What happens when you when you update a receipt?
4. Can any of this be improved?

# Part 1.3: What we've learned in Part 1

> Thank you for participating

- The back end can be "turn key" only requiring a simple YAML file
- Basic HTML is enough to prototype a minimal web application
  - A little JavaScript, browser side turns an API into a working prototype
- Our prototype is only a starting point

Improve the user experience with in Part 2 of the workshop, [Dataset & Web Components](presentation2.html)

# Reference: Dataset

- [Dataset Project](https://caltechlibrary.github.io/dataset)
- [Dataset Repository](https://github.com/caltechlibrary/dataset)
- [Getting help with Dataset](https://github.com/caltechlibrary/dataset/issues)


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

# Thank you for participating

- View presentations: 
  - <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation1.html>
  - <https://caltechlibrary.github.io/t2t3_dataset_web_apps/presentation2.html>
- View the repository: <https://github.com/caltechlibrary/t2t3_dataset_web_apps>
- Comment on this presentation: <https://github.com/caltechlibrary/t2t3_dataset_web_apps/issues>
- Author: R. S. Doiel, <mailto:rsdoiel@caltech.edu>

