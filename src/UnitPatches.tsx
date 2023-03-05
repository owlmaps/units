import UnitPatch from "./UnitPatch";

const UnitPatches = ({patches}: Patches) => {

  // if we don't have any patches, show nothing
  if (!patches) {
    return null;
  }

  const patchList: Array<JSX.Element> = [];
  patches.forEach((patch, idx) => {
    patchList.push(<UnitPatch key={idx} patch={patch} />);
  });

  return <div className="unit-patches">{patchList}</div>
};

export default UnitPatches;