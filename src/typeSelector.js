import { component } from 'd3-component';
import { set } from 'd3-collection';

// The component for radio button input fields.
const radioButtonInput = component('input')
  .render((selection, d) => {
    selection
        .attr('type', 'radio')
        .attr('name', d.type)
        .property('checked', d.checked)
        .on('click', d.onClick);
  });

// The component for radio button label fields.
const radioButtonLabel = component('label')
  .render((selection, fieldName) => {
    selection.text(fieldName);
  });

// The component for radio button containers.
const radioButton = component('div', 'ui radio checkbox')
  .render((selection, d) => {
    selection
      .call(radioButtonInput, d)
      .call(radioButtonLabel, d.type);
  });

// The component for individual fields.
const field = component('div', 'field')
  .render(radioButton);

// The reset button components.
const resetButton= component('button', 'ui primary button')
  .render((selection, onReset) => {
    selection
      .text('Reset selection')
      .on('click', onReset);
  });
const resetButtonField = component('div', 'field')
  .render(resetButton);

// The element containing inline form fields.
const fields = component('div', 'inline fields')
  .render((selection, d) => {
    const selectedTypesSet = set(d.selectedTypes);
    selection
      .call(field, d.availableTypes.map(type => ({
        type,
        checked: selectedTypesSet.has(type),
        onClick: clicked => {
          clicked.checked = !clicked.checked;
          if (clicked.checked) {
            selectedTypesSet.add(clicked.type);
          } else {
            selectedTypesSet.remove(clicked.type);
          }
          d.onChange(selectedTypesSet.values());
        }
      })))
      .call(resetButton, d.onReset);
  });

// The top-level form element containing all buttons.
const typeSelector = component('div', 'ui form')
  .render(fields);

export default typeSelector;
