import { sum } from 'd3-array';
import dateFromYear from './dateFromYear';

// Compute the context stream data,
// as the sum total of all countries across all years.
const contextStreamData = srcData => {
  return Object.keys(srcData).map(year => ({
    date: dateFromYear(year),
    total: sum(Object.values(srcData[year]))
  }));
}
export default contextStreamData;
