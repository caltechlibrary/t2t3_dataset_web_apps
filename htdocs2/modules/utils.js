/**
 * utils.js is responsible for retrieving the key from the URL parameters and for retrieving data from the JSON API.
 * It is used by each JavaScript page module.
 */

/**
 * getKey retrieves the "key" specified in the URL parameters
 * @return a string holding the key or an empty string is key not known
 */
export function getKey() {
  const queryString = globalThis.location.search;
  const params = new URLSearchParams(queryString);
  const key = params.get("key");
  if (key === undefined || key === null) {
    return "";
  }
  return key.trim();
}

// apiURL is the path to the API relative to the modules directory. 
// The browser will resolve the request to the a specific part or hostname.
// NOTE: the dataset collection needed to be updated in the path compared to version 1!!!!
const apiBaseURL = "../api/recipes.ds";

/**
 * getRecipes retieves a list of recipes using the query API we defined in recipes_api.yaml.
 * @returns a promise of data or it throws an error.
 */
export async function getRecipes() {
  const apiURL = `${apiBaseURL}/query/list_recipes`;
  const method = "POST";

  const response = await fetch(apiURL, { method: method });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const data = await response.json();

  return data;
}

/**
 * getRecipe retrieves an individual object using the "object" end point provided by datasetd.
 * Note the read permission in recipes_api.yaml needs to be set to true.
 * @params key: string, this is the object key to retrieve.
 * @returns a promise of the object or it throws an error.
 */
export async function getRecipe(key) {
  const apiURL = `${apiBaseURL}/object/${key}`;
  const method = "GET";

  const response = await fetch(apiURL, { method: method });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

/**
 * saveRecipe takes the contents of the web page and then sends them the web service.
 * One of the important roles of this function is to handle response from the web server.
 * IF there is an error, then the browser should remaing on the edit page with appropriate
 * messaging to convey the options to correct the error.  If the submission is successful then
 * the browser should be redirected the the display page of the editing receipt.
 * @param event, this is the event passed by the `addEventListener` function.
 */
export async function saveRecipe(event) {
  // Prevent the default form submission
  event.preventDefault();
  const ingredientsTextarea = document.getElementById('ingredients');

  // Retrieve and setup data for submission
  const form = event.target;
  const formData = new FormData(form);

  // Remove the submit and cancel button data
  // NOTE: In our form we called the submit button "save", so that's what we remove.
  formData.delete("save"); //formData.delete("submit");
  formData.delete("cancel");
  // We need to turn the value held by our custom element into a CSV data ..
  formData.set('ingredients', ingredientsTextarea.toCSV());
  //return ; // DEBUG

  // Convert FormData to URL-encoded string
  const urlEncodedData = new URLSearchParams(formData).toString();

  // Decide where things are going
  let isUpdate = true;
  let key = getKey();
  if (key === "") {
    const inputKey = form.elements[0];
    key = inputKey.value;
    isUpdate = false;
  }
  const apiURL = `${apiBaseURL}/object/${key}`;
  const displayPage = `display_recipe.html?key=${key}`;
  let editPage = `edit_recipe.html`;
  if (isUpdate) {
    editPage = `edit_recipe.html?key=${key}`;
  }
  const method = "POST";
  const contentType = { "Content-Type": "application/x-www-form-urlencoded" };

  const response = await fetch(apiURL, {
    method: method,
    headers: contentType,
    body: urlEncodedData,
  });
  if (response.ok) {
    // We're good do display the saved recipe.
    globalThis.location.href = displayPage;
    return;
  }
  // Return to the edit page pass the error through the parameters
  if (isUpdate) {
    globalThis.location.href = `${editPage}&error=${response.statusText}`;
  } else {
    globalThis.location.href = `${editPage}?error=${response.statusText}`;
  }
}
