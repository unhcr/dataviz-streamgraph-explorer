import { scaleOrdinal, schemeCategory10 } from 'd3-scale';
import allCountries from './allCountries'

// Create the color scale used in the StreamGraphs.
// The colors should be consistently used, one color
// for each country, no matter what filters are applied.

//d3.hcl(t * 360, 100, 55)

export default scaleOrdinal()
  .range(schemeCategory10)
  .domain(allCountries);
