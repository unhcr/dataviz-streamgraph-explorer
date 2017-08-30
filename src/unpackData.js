// This function unpacks the data loaded from data/data.js.
// The packing happened in a pre-processing step, in data/process.json.
export default function(packedData) {
  const data = [];

  const codeValues = packedData.codeValues;
  const nested = packedData.nested;

  const years = Object.keys(nested);
  years.forEach(year => {
    const byType = nested[year];
    Object.keys(byType).forEach(type => {
      const bySrcCode = byType[type];
      Object.keys(bySrcCode).forEach(srcCode => {
        const src = codeValues[srcCode];
        const byDestCode = bySrcCode[srcCode];
        Object.keys(byDestCode).forEach(destCode => {
          const dest = codeValues[destCode];
          const value = byDestCode[destCode];

          data.push({ year, src, dest, type, value });

        });
      });
    });
  });

  return data;
};
