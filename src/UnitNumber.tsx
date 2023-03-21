const UnitNumber = (props: UnitNumber) => {
  const { level, unitnumber } = props;

  if (!unitnumber || unitnumber === '') {
    return null;
  }    

  return (
    <div className={`unit-number level-${level}`}>No. {unitnumber}</div>
  )

}

export default UnitNumber;