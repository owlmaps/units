import UnitSocials from "./UnitSocials";
import UnitNumber from "./UnitNumber";

const UnitHeader = (props: Unit) => {
  
  const { name, parent, meta, level } = props;

  // level spacer
  const levelSpacer = '-'.repeat(level);

  // unit title
  const unitTitle = parent
    ? `${levelSpacer} ${name} (${parent})`
    : name;

  // unit number
  const unitNumber = <UnitNumber {...meta} level={level}/>;

  // display social media links if we have any
  const unitSocials = <UnitSocials {...meta}/>;

  return (
    <div className={`unit-header level-${level}`}>
      <h3 className={`unit-title level-${level}`}>{unitTitle}</h3>
      {unitNumber}
      {unitSocials}
    </div>
  );
};

export default UnitHeader;