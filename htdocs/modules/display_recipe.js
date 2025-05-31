/**
 * display_recipe.js is a module that uses the Dataset JSON API for recipes_api.yaml to retrieves
 * the recipe from the recipes.ds collection.
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
 * populatePage takes the results of the JSON API query and renders the LI for the UL list
 * @param key: string, recipe identifing the recipe
 * @param data: object, the recipe metadata
 */
function populatePage(key, data) {
  const editElem = document.getElementById("edit-recipe");
  const nameElem = document.getElementById("name");
  const ingredientsElem = document.getElementById("ingredients");
  const procedureElem = document.getElementById("procedure");
  
  // Clear the edit, name, ingredients and procedureElem elements
  editElem.href = `edit_recipe.html?key=${key}`;
  if (data['name'] !== undefined && data['name'] !== null) {
    nameElem.innerHTML = data['name'].trim();
  }
  //ingredientsElem.innerHTML = "";
  const table = document.createElement("table");
  const tableHeader = document.createElement("theader");
  const tableBody = document.createElement("tbody");
  const headerTr = document.createElement("tr");
  const th1 = document.createElement("th");
  const th2 = document.createElement("th");

  th1.innerHTML = "Ingredients";
  th2.innerHTML = "Units";
  headerTr.appendChild(th1);
  headerTr.appendChild(th2);
  tableHeader.appendChild(headerTr);
  if (data['ingredients']) {// !== undefined && data['ingredients'] !== null) {
    for (const key of Object.keys(data['ingredients'])) {
      const val = data['ingredients'][key];
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      td1.innerHTML = key;
      td2.innerHTML = val;
      tr.appendChild(td1);
      tr.appendChild(td2);
      tableBody.appendChild(tr);
    }
  }
  table.appendChild(tableHeader);
  table.appendChild(tableBody);
  ingredientsElem.style.visibility = 'hidden';
  ingredientsElem.innerHTML = '';
  ingredientsElem.appendChild(table);
  ingredientsElem.style.visibility = 'visible';
  if (data['procedure']) {
    procedureElem.innerHTML = data['procedure'].trim().replaceAll(/\n/g,'<p>');
  }
}

/**
 * displayRecipe contacts the JSON API and populates the page.
 */
async function displayRecipe() {
  const key = getKey();
  const data = await retrieveRecipeFromAPI(key);

  populatePage(key, data);
}

/**
 * Wait until the page is loaded before updating.
 */
document.addEventListener("DOMContentLoaded", await displayRecipe());
