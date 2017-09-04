import { component } from 'd3-component';

// The component for radio button input fields.
const radioButtonInput = component('input')
  .render((selection, d) => {
    selection
        .attr('type', 'radio')
        .attr('name', d.type)
        .property('checked', d.checked);
  });

// The component for radio button label fields.
const radioButtonLabel = component('label')
  .render((selection, fieldName) => {
    selection.text(fieldName);
  });

// The component for radio button containers.
const radioButton = component('div', 'ui radio checkbox')
  .render((selection, d) => {
    console.log(d);
    selection
      .call(radioButtonInput, d)
      .call(radioButtonLabel, d.type);
  });

// The component for individual fields.
const field = component('div', 'field')
  .render(radioButton);

// The element containing inline form fields.
const fields = component('div', 'inline fields')
  .render((selection, d) => {
    selection.call(field, d.availableTypes.map(type => ({
      type,
      checked: d.selectedTypes.indexOf(type) !== -1
    })));
  });

// The top-level form element containing all buttons.
const typeSelector = component('div', 'ui form')
  .render(fields);

export default typeSelector;

//        <div class="field">
//          <button class="ui primary button">
//            Reset selection
//          </button>
//        </div>
