import { component } from 'd3-component';
const form = component('div', 'ui form'); 
export default function typeSelector(selection){
  form(selection);
//  selection.html(`
//    <div class="ui form">
//      <div class="inline fields">
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
//      </div>
//    </div>
//  `);
}
