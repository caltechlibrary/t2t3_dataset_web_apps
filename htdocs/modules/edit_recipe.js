/**
 * edit_recipe.js is a module that uses the Dataset JSON API for recipes_api.yaml to list
 * the recipes in the recipes.ds collection.
 */
import { getKey, getRecipe } from './utils.js';


/**
 * updateFormAction will update the URL to add a specific key.
 */
function updateFormActionURL(form, key) {
   console.log(`DEBUG what is the key value? ${key}, form action -> ${form.action}`);
   let u = URL.parse(form.action);
   let parts = u.pathname.split('/');
   const lastPos = parts.length - 1;
   let pos = parts.indexOf("object")
   console.log(`DEBUG parts -> ${parts.join('/')}`);
   if (pos < lastPos) {
    parts.pop();
   }
   console.log(`DEBUG parts after pop -> ${parts.join('/')}`);
   parts.push(key);
   u.pathname = parts.join('/');
   console.log(`DEBUG action is now ${u.toString()}`);
   form.action = u.toString();
   return form.action;
}

/**
 * displayWebForm takes the results of the JSON API query and renders the LI for the UL list
 * @param key: string, recipe identifing the recipe
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
    keyInput.value = key;
    keyInput.setAttribute('readonly', true);
    updateFormActionURL(form, key);
  } else {
    keyInput.setAttribute('required', true);
    // FIXME: Key is special, it needs to form the URL for creating objects in the API.
    // When the key is set in the web form it needs to update the URL specified in the action.
    keyInput.addEventListener('change', function (evt) {
      let key = evt.target.value;
      if (key !== '') {
        updateFormActionURL(form, key);
      }
    })
  }
  if (data !== null) {
    if (data['name'] !== undefined) {
      nameInput.value = data['name'];
    }
    if (data['url'] !== undefined) {
      urlInput.value = data['url'];
    }
    if (data['ingredients'] !== undefined) {
      ingredientsTextarea.innerHTML = data['ingredients'];
    }
    if (data['procedure'] !== undefined) {
      procedureTextarea.innerHTML = data['procedure'];
    }
  }
}


/**
 * populatePage contacts the JSON API and populates the page.
 */
async function populatePage() {
  const form = document.getElementById('edit-recipe');
  const key = getKey();
  let data = null;
  if (key !== '') {
    data = await getRecipe(key);
  }
  console.log(`DEBUG before, form.method -> ${form.method}, form.action -> ${form.action}`);
  displayWebFrom(key, data);
  console.log(`DEBUG after, form.method -> ${form.method}, form.action -> ${form.action}`);
}

/**
 * Wait until the page is loaded before updating.
 */
document.addEventListener("DOMContentLoaded", await populatePage());
