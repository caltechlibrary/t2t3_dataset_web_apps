/**
 * list_recipes.js is a module that uses the Dataset JSON API for recipes_api.yaml to list
 * the recipes in the recipes.ds collection.
 */
import { getRecipes } from "./utils.js";

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
  /*
  const ul = document.getElementqById("recipe-list");
  // Clear our UL list
  ul.innerHTML = "";
  // Get our list
  const data = await getRecipes();
  // Now populate it with "data"
  populateUL(ul, data);
  */
 const aToZList = document.querySelector('a-to-z-list');
 console.log(aToZList);
 const ul = document.createElement('ul');
 const data = await getRecipes();
 populateUL(ul, data);
 aToZList.innerHTML = ul.outerHTML;
// aToZList.render()
}

/**
 * Wait until the page is loaded before updating.
 */
document.addEventListener("DOMContentLoaded", await listRecipes());
