/**
 * edit_recipe.js is a module that uses the Dataset JSON API for recipes_api.yaml to list
 * the recipes in the recipes.ds collection.
 */

/**
 * getKey retrieves the "key" specified in the URL parameters
 */
function getKey() {
  const queryString = globalThis.location.search;
  const params = new URLSearchParams(queryString);
  const key = params.get("key");
  if (key === undefined || key === null) {
    return "";
  }
  return key.trim();
}

/**
 * retrieveRecipeFromAPI shows the basic way to use "fetch" to retrieve results from
 * the object endpoint of the JSON API provided by dastasetd.
 * @param key: string
 */
async function retrieveRecipeFromAPI(key) {
  const apiURL = `http://localhost:8001/api/recipes.ds/object/${key}`;
  const method = "GET";
  console.log(`DEBUG method: ${method}, URL:  ${apiURL}`);
  const response = await fetch(apiURL, { method: method });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const data = await response.json();
  console.log(`DEBUG data -> ${JSON.stringify(data)}`);
  return data;
}


/**
 * displayWebForm takes the results of the JSON API query and renders the LI for the UL list
 * @param key: string, recipe identifying the recipe
 * @param data: object, the recipe metadata
 */
function displayWebFrom(key, data) {
  const form = document.getElementById('edit-recipe');
  const keyInput = document.getElementById('key');
  const nameInput = document.getElementById('name');
  const urlInput = document.getElementById('url');
  const ingredientsTextarea = document.getElementById('ingredients');
  const procedureTextarea = document.getElementById('procedure');
  if (key !== undefined && key !== '') {
    console.log(`DEBUG editing ${key}`);
    keyInput.value = key;
    keyInput.setAttribute('readonly', true);
  } else {
    console.log(`DEBUG creating new recipe`);
    keyInput.setAttribute('required', true);
  }
  if (data['name']) {
    nameInput.value = data['name'].trim();
  }
  if (data['url']) {
    urlInput.value = data['url'].trim();
  }
  if (data['ingredients']) {
//    console.log(data['ingredients'])
    const lines = [];
    lines.push('ingredients,units');
    for (const key of Object.keys(data['ingredients'])) {
      if (key !== 'ingredients') {
        const val = data['ingredients'][key].trim();
        lines.push(`${key},${val}`);
      }
    }
    console.log(lines.join("\n"));
    ingredientsTextarea.innerHTML = lines.join("\n");
  }
  if (data['procedure']) {
    procedureTextarea.innerHTML = data['procedure'].trim();
  }
}

/**
 * sendFormData packages and sends the form data to the JSON API as a POST.
 */
async function sendFormData(key) {
  let apiURL = 'http://localhost:8001/api/recipes.ds/object';
  let method = "POST";

  let keyInput = document.getElementById('key');
  let nameInput = document.getElementById('name');
  let urlInput = document.getElementById('url');
  let ingredientsTextarea = document.getElementById('ingredients');
  let procedureTextarea = document.getElementById('procedure');

  if (key === undefined && key === '') {
    apiURL += '/' + keyInput.value;
    method = "POST";
    console.log(`DEBUG looks like we are triggering a "create" request, via  POST ${apiURL}`);
  } else {    
    apiURL += '/' + key;
    method = "PUT";
    console.log(`DEBUG looks like we are triggering a "create" request, via PUT ${apiURL}`);
  }
  console.log(`DEBUG method: ${method}, URL:  ${apiURL}`);
  const data = {};
  if (keyInput.value) {
    console.log(`DEBUG adding keyInput.value ->${keyInput.value}`);
    data['key'] = keyInput.value;
  }
  if (nameInput.value) {
    console.log(`DEBUG adding nameInput.value ->${nameInput.value}`);
    data['name'] = nameInput.value;
  }
  if (urlInput.value) {
    console.log(`DEBUG adding urlInput.value ->${urlInput.value}`);
    data['url'] = urlInput.value;
  }
  if (ingredientsTextarea.innerHTML) {
    // Remove the heading line first line
    let lines = ingredientsTextarea.innerHTML.replace(/^ingredients,units\n/ig, '').split("\n");
    let ingredientList = {};
    // NOTE: This is a very naive CSV parse, you really want to use something like Papa parse or @std/csv from jsr.io ...
    for (const line of lines) {
      if (line.trim() !== '' && line.indexOf(',') > -1) {
        const parts = line.split(',', 2);
        const id = parts[0].trim();
        if (parts.length > 1) {
          ingredientList[id] = parts[1].trim();
        } else {
          ingredientList[line.trim()] = '';
        }
      }
    }
    data['ingredients'] = ingredientList;
  }
  if (procedureTextarea.innerHTML) {
    data['procedure'] = procedureTextarea.innerHTML;
  }
  console.log(`DEBUG data -> ${JSON.stringify(data, null, 2)}`);
  // NOTE!!!!!!: You really need to validate this object before sending it ...
  setTimeout(() => {
    console.log("Delayed for 20 second. Data to be sent ->", JSON.stringify(data));
  }, "20000");
  console.log(`DEBUG making a ${method} to ${apiURL} with data -> ${JSON.stringify(data)}`);
  const response = await fetch (apiURL, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
}


/**
 * displayRecipe contacts the JSON API and populates the page.
 */
async function displayRecipe() {
  let data = {};
  let key = getKey();
  if (key !== undefined && key !== '') {
    console.log(`DEBUG retrieving data from API for ${key}`);
    data = await retrieveRecipeFromAPI(key);
  }
  const saveButton = document.getElementById('save');
  const cancelButton = document.getElementById('cancel');
  let keyInput = document.getElementById('key');

  console.log(`DEBUG key -> ${key}`);
  displayWebFrom(key, data);
  console.log(`DEBUG adding event listener for saveButton -> ${saveButton.innerHTML}`);
  saveButton.innerHTML = "Save Recipe";
  saveButton.addEventListener('click', async function(evt) {
    console.log('DEBUG saveButton event listener', evt);
    evt.preventDefault();
    if ((key === undefined || key === '') && (keyInput.value === '')){
      console.error('DEBUG blocking form submission if data not available')
      return;
    }
    const response = await sendFormData(key);
    if (response.ok) {
      alert('DEBUG Form Submitted OK');
      window.location.href = `display_recipe.html?key=${key}`;
      return;
    }
    alert(`form failed to submit ${response.status}`);
  });

  cancelButton.addEventListener('click', function (evt) {
    if (key === undefined || key === '') {
      // If we are aborting creation of a new recipe just go back to the list.
      window.location.href = './';
      return;
    }
    // If not go to the display page
    window.location.href= `display_recipe.html?key=${key}`;
    return;
  });
}

/**
 * Wait until the page is loaded before updating.
 */
document.addEventListener("DOMContentLoaded", await displayRecipe());
