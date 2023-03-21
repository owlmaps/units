const UnitNumber = (props: UnitNumber) => {
  const { level, unitnumber } = props;

  if (!unitnumber || unitnumber === '') {
    return null;
  } 

  return (
    <div className={`unit-number level-${level}`}>{'\u2116'} {unitnumber}</div>
  )

}

export default UnitNumber;