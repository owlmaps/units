import UnitPatch from "./UnitPatch";

const UnitPatches = (props: Unitpatches) => {
  
  let { patches } = props;

  // if we don't have any patches, show nothing
  if (!patches) {
    return null;
  }

  // don't show units with unknown logos (set during search operations)
  if (patches.length === 1 && patches[0].thumb === 'images/unknown.jpg') {
    return null;
  }

  const patchList: Array<JSX.Element> = [];
  patches.forEach((patch, idx) => {
    patchList.push(<UnitPatch key={idx} {...patch} />);
  });

  return <div className="unit-patches">{patchList}</div>
};

export default UnitPatches;