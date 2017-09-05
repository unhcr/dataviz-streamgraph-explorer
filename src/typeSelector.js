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
  .render((selection, d) => {
    selection
        .text(d.type)
        .style('cursor', 'pointer')
        .style('user-select', 'none')
        .on('click', d.onClick);
  });

// The component for radio button containers.
const radioButton = component('div', 'ui radio checkbox')
  .render((selection, d) => {
    selection
      .call(radioButtonInput, d)
      .call(radioButtonLabel, d);
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

    // Create a Set of the selected types.
    const selectedTypesSet = set(d.selectedTypes);

    // Render a field component for each available type.
    selection
      .call(field, d.availableTypes.map(type => ({

        // Pass in the type name for labeling.
        type,

        // Make it checked if it's a selected type.
        checked: selectedTypesSet.has(type),

        // When a checkbox is clicked...
        onClick: clicked => {

          // Invert its checked property.
          clicked.checked = !clicked.checked;

          // Add or remove it from the set of selected types.
          if (clicked.checked) {
            selectedTypesSet.add(clicked.type);
          } else {
            selectedTypesSet.remove(clicked.type);
          }

          // Pass the array of selected types
          // to the listener passed in from outside.
          d.onChange(selectedTypesSet.values());
        }
      })))
      .call(resetButton, d.onReset);
  });

// The top-level form element containing all buttons.
const typeSelector = component('div', 'ui form')
  .render(fields);

export default typeSelector;
