/**
 * utils.js is responsible for retrieving the key from the URL parameters and for retrieving data from the JSON API.
 * It is used by each JavaScript page module.
 */

/**
 * getKey retrieves the "key" specified in the URL parameters
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


// apiURL is the path to the API relative to the modules directory. The browser will resolve the request to the a specific part or hostname.
const apiBaseURL = '../api/recipes.ds';

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