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
customElements.define( 'hello-clock', HelloClock );