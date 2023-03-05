import SocialMedia from "./SocialMedia";

const UnitHeader = (props: Unit) => {
  
  const { name, parent, meta, level } = props;

  // level spacer
  const levelSpacer = '-'.repeat(level)

  // unit title
  const unitTitle = parent
    ? `${levelSpacer} ${name} (${parent})`
    : name;

  // display social media links if we have any
  const socialmedia = <SocialMedia {...meta}/>

  return (
    <div className={`unit-header level-${level}`}>
      <h3 className={`unit-title level-${level}`}>{unitTitle}</h3>
      {socialmedia}
    </div>
  );
};

export default UnitHeader;