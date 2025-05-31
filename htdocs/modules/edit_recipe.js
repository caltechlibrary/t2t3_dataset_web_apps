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
 * @param key: string, recipe identifing the recipe
 * @param data: object, the recipe metadata
 */
function displayWebFrom(key, data) {
  const form = documents.getElementById('edit-recipe');
  const keyInput = document.getElementById('key');
  const nameInput = document.getElementById('name');
  const urlInput = document.getElementById('url');
  const ingredientsTextarea = document.getElementById('ingredients');
  const procedureTextarea = document.getElementById('procedure');
  if (key !== undefined && key !== '') {
    keyInput.value = key;
    keyInput.setAttribute('readonly', true);
  }
  if (data['name']) {
    nameInput.value = data['name'];
  }
  if (data['url']) {
    urlInput.value = data['url'];
  }
  if (data['ingredients']) {
//    console.log(data['ingredients'])
    const lines = [];
    lines.push('ingredients,units');
    for (const key of Object.keys(data['ingredients'])) {
      const val = data['ingredients'][key];
      lines.push(`${key},${val}`);
    }
    console.log(lines.join("\n"));
    ingredientsTextarea.innerHTML = lines.join("\n");
  }
  if (data['procedure']) {
    procedureTextarea.innerHTML = data['procedure'];
  }
}

/**
 */
async function sendFormData(key) {
  console.log(`sendFormData(${key}) not implemented.`);
}

/**
 * handleSubmission handles the case of when the web form's submit or cancel buttons are pressed.
 */
async function handleSubmission(key) {
  const saveButton = document.getElementById('save');
  const cancelButton = document.getElementById('cancel');
  saveButton.addEventListener('click', async (evt) => {
    const response = await sendFormData(key);
    if (response.ok) {
      window.location.href = `display_recipe.html?key=${key}`
    }
  });

  cancelButton.addEventListen('click', function (evt) {
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
 * displayRecipe contacts the JSON API and populates the page.
 */
async function displayRecipe() {
  const key = getKey();
  const data = await retrieveRecipeFromAPI(key);
  console.log(`DEBUG key -> ${key}`);
  displayWebFrom(key, data);
  const response = await handleSubmission(key);
  console.log(response);
}

/**
 * Wait until the page is loaded before updating.
 */
document.addEventListener("DOMContentLoaded", await displayRecipe());
