/**
 * hello-clock.js provides an example of a simple Web Component that says hello then displays the time.
 */

// Define our new element as a class
class HelloClock extends HTMLElement {

  // Hook used by browser to instanciate the element in the page
  connectedCallback() {
    // Get the current time as an object
    const d = new Date();
    // Update the inner text to include our time string
    this.textContent = `${this.textContent} ${d.toTimeString()}`.trim();
  }
}

// This is how the browsers learns to use the new HTML element.
// NOTE: you element name should include a dash in it to avoid clashing with
// HTML elements that are part of the standard (future proofing your element).
customElements.define( 'hello-clock', HelloClock );
