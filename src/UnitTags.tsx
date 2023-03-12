const UnitTags = (props: MetaData) => {
  const { tags } = props;

  if (!tags) {
    return null;
  }

  return <div className="unit-tags">Tags: {tags}</div>;

}

export default UnitTags;