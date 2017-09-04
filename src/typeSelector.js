import { component } from 'd3-component';

// The component for individual fields (radio buttons).
const field = component('div', 'field')
  .render((selection, fieldName) => {
    selection.text(fieldName);
  });

// The element containing inline form fields.
const fields = component('div', 'inline fields')
  .render((selection, d) => {
    console.log(d);
    selection.call(field, d.availableTypes);
  });

// The top-level form element containing all buttons.
const typeSelector = component('div', 'ui form')
  .render(fields);

export default typeSelector;
//  selection.html(`
//        <div class="field">
//          <div class="ui radio checkbox">
//            <input type="radio" name="frequency" checked="checked">
//            <label>Refugees</label>
//          </div>
//        </div>
//        <div class="field">
//          <div class="ui radio checkbox">
//            <input type="radio" name="frequency">
//            <label>Asylum-seekers</label>
//          </div>
//        </div>
//        <div class="field">
//          <div class="ui radio checkbox">
//            <input type="radio" name="frequency">
//            <label>IDPs</label>
//          </div>
//        </div>
//        <div class="field">
//          <div class="ui radio checkbox">
//            <input type="radio" name="frequency">
//            <label>Returnees</label>
//          </div>
//        </div>
//        <div class="field">
//          <div class="ui radio checkbox">
//            <input type="radio" name="frequency">
//            <label>Stateless persons</label>
//          </div>
//        </div>
//        <div class="field">
//          <div class="ui radio checkbox">
//            <input type="radio" name="frequency">
//            <label>Other persons of concern</label>
//          </div>
//        </div>
//        <div class="field">
//          <button class="ui primary button">
//            Reset selection
//          </button>
//        </div>
//  `);
