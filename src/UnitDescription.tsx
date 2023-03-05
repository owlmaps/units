const UnitDescription = (props: MetaData) => {
  const { description } = props;

  if (!description) {
    return null;
  }

  return <div className="unit-description">{description}</div>;

}

export default UnitDescription;