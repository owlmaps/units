import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import Unit from './Unit';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip';


const UnitsPage = (props: UnitsPage) => {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isCompactMode, setIsCompactMode] = useState(true);

  const { who } = props;

  let title = "";
  let datafile = '';
  switch (who) {
    case 'ua':
      title = 'Ukrainian Units';
      datafile = 'ua.json';
      break;
    case 'ru':
      title = 'Russian Units';
      datafile = 'ru.json';
      break;  
    default:
      break;
  }

  const onCompactMode = () => {
    setIsCompactMode(!isCompactMode);
  }

  const fetchData = () => {
    fetch(`./${datafile}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
  }

  useEffect(() => {
    fetchData();
  }, [])

  // generate all unit components
  const units: any = [];

  // loop through all base units
  data.forEach((unitData: Unit, idx) => {
    const unit= (
      <div key={idx} className="unit-wrapper">
        <Unit {...unitData} compact={isCompactMode} />
      </div>
      );
    units.push(unit);
  });

  const content = isLoading
  ? <div className="loading">Loading...</div>
  : (<div className="units">{units}</div>);

  const compactModeText = isCompactMode
    ? 'Details'
    : 'Compact';

  // finally, return everything
  return (
    <div className="unitspage">
      <header>
        <Link to="/" id="homelink">[ Home ]</Link> 
        <h3 className="units-title">{title}</h3>
        <button id="compactmode" onClick={onCompactMode}>[ {compactModeText} ]</button>
      </header>
      <div className='scrollbox'>
        <div className="max-wrapper">{units}</div>   
      </div>  
      <Tooltip anchorSelect=".patch-image" id="patch-tooltip"/>
    </div>
  
  );
};

export default UnitsPage;