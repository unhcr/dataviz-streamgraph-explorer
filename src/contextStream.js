const contextStream = (selection, props) => {
  console.log(props.data);
  selection.append('rect')
    .attr('x', props.box.x)
    .attr('y', props.box.y)
    .attr('width', props.box.width)
    .attr('height', props.box.height)
    .attr('fill', 'pink');
};
export default contextStream;
