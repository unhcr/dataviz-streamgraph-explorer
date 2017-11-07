import { scaleOrdinal } from 'd3-scale';
import { hcl } from 'd3-color';
import allCountries from './allCountries'

// Create the color scale used in the StreamGraphs.
// The colors should be consistently used, one color
// for each country, no matter what filters are applied.
export default scaleOrdinal()
  .domain(allCountries)
  .range(allCountries.map((country, i) => {
    const t = i / allCountries.length;
    return hcl(t * 360, 50, 70);
  }));
