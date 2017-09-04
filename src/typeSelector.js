import { component } from 'd3-component';

// The component for radio button input fields.
const radioButtonInput = component('input')
  .render((selection, fieldName) => {
    selection
        .attr('type', 'radio')
        .attr('name', 'frequency')
        .attr('checked', 'checked');
  });

// The component for radio button label fields.
const radioButtonLabel = component('label')
  .render((selection, fieldName) => {
    selection.text(fieldName);
  });

// The component for radio button containers.
const radioButton = component('div', 'ui radio checkbox')
  .render((selection, fieldName) => {
    selection
      .call(radioButtonInput, fieldName)
      .call(radioButtonLabel, fieldName);
  });

// The component for individual fields.
const field = component('div', 'field')
  .render((selection, fieldName) => {
    selection.call(radioButton, fieldName);
  });

// The element containing inline form fields.
const fields = component('div', 'inline fields')
  .render((selection, d) => {
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
