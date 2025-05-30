/**
 * list_recipes.js is a module that uses the Dataset JSON API for recipes_api.yaml to list
 * the recipes in the recipes.ds collection.
 */


/**
 * retrieveRecipesFromAPI shows the basic way to use "fetch" to retrieve results from 
 * the query end of the JSON API provided by dastasetd.
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