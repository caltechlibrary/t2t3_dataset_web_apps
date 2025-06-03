/**
 * display_recipe.js is a module that uses the Dataset JSON API for recipes_api.yaml to retrieves
 * the recipe from the recipes.ds collection.
 */
import { getKey, getRecipe } from "./utils.js";

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
    for (let line of data['ingredients'].split("\n")) {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      if (line.indexOf('","') > -1) {
        line = line.trim('"');
        console.log(`DEBUG unquoted line -> ${line}`);
        [td1.innerHTML, td2.innerHTML ] = line.split('","', 2);
      } else if (line.indexOf(',') > -1 ) {
        [td1.innerHTML, td2.innerHTML ] = line.split(',', 2);
      } else {
        [td1.innerHTML, td2.innerHTML ]= [line, ''];
      }
      // Down add the CSV header line if it is proved.
      if (td1.innerHTML.startsWith('ingredient') === false) {
        tr.appendChild(td1);
        tr.appendChild(td2);
        tableBody.appendChild(tr);
      }
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
  const data = await getRecipe(key);

  populatePage(key, data);
}

/**
 * Wait until the page is loaded before updating.
 */
document.addEventListener("DOMContentLoaded", await displayRecipe());
