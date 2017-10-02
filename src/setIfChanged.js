// Sets the value of the given reactive property if it has changed.
const setIfChanged = property => value => {
  if(property() !== value) {
    property(value);
  }
};
export default setIfChanged;
