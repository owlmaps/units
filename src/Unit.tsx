import UnitHeader from "./UnitHeader";
import UnitDescription from "./UnitDescription";
import UnitPatches from "./UnitPatches";
import UnitPatchCompact from "./UnitPatchCompact";

const Unit = (props: Unit) => {

  // extract all possible data
  const { name, meta, patches, subunits, level, compact } = props;

  // unit header
  const unitHeader = <UnitHeader {...props}/>

  // unit description
  const unitDescription = compact
    ? null
    : <UnitDescription {...meta} />

  // unit patches
  const unitPatches = compact
    ? null
    : <UnitPatches patches={patches}/>

  // subunits
  const subunitList: Array<JSX.Element> = [];

  const _extractAllPatches = (props: Unit) => {
    const { name, patches, subunits, parents } = props;
    const unitParents = (parents)
      ? [...parents, name]
      : [name]
    // console.log(`extract patches from unit ${name}`, props);
    const patchList: Array<any> = [];
    // first get patches of the current unit
    if (patches) {
      patches.forEach((patch) => {
        patchList.push({ patch, parents: unitParents });
      });
    }
    // now get patches of possible subunits
    if (Array.isArray(subunits)) {
      subunits.forEach((subunit) => {
        subunit.parents = unitParents;
        const subunitPatches = _extractAllPatches(subunit);
        patchList.push(subunitPatches.flat());
      })
    }
    // return patchlist
    return patchList;
  }

  // in compact mode we only display patches
  // in normal mode display the full unit info
  let patchesCompact: JSX.Element | null = null;
  if (compact) { 
    const subunitPatchList: Array<JSX.Element> = [];
    const patchList = _extractAllPatches(props);
    // console.log(patchList.flat());
    patchList
      .flat()
      .forEach((patch, idx) => {
        subunitPatchList.push(<UnitPatchCompact key={idx} {...patch}/>);
      });
    if (subunitPatchList && subunitPatchList.length > 0) {
      patchesCompact = <div className="unit-patches">{subunitPatchList}</div>
    }   
    
  } else {
    if (Array.isArray(subunits)) {
      subunits.forEach((subunit, idx) => {
        subunitList.push(<Unit key={idx} {...subunit}/>);
      });
    }
  }

  return (
    <div className={`unit level-${level}`}>
      {unitHeader}
      {unitDescription}
      {unitPatches}
      {subunitList}
      {patchesCompact}
    </div>
  );
};

export default Unit;