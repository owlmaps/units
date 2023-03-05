import UnitHeader from "./UnitHeader";
import UnitDescription from "./UnitDescription";
import UnitPatches from "./UnitPatches";

const Unit = (props: Unit) => {

  // extract all possible data
  const { name, meta, patches, subunits, level } = props;

  // unit header
  const unitHeader = <UnitHeader {...props}/>

  // unit description
  const unitDescription = <UnitDescription {...meta} />

  // unit patches
  const unitPatches = <UnitPatches patches={patches}/>

  // now adding subunits recursively
  const subunitList: Array<JSX.Element> = [];
  if (Array.isArray(subunits)) {
    subunits.forEach((subunit, idx) => {
      subunitList.push(<Unit key={idx} {...subunit}/>);
    });
  }

  return (
    <div className={`unit level-${level}`}>
      {unitHeader}
      {unitDescription}
      {unitPatches}
      {subunitList}
    </div>
  );
};

export default Unit;