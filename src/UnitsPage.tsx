import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import Unit from './Unit';

const UnitsPage = (props: UnitsPage) => {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

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
        <Unit {...unitData} />
      </div>
      );
    units.push(unit);
  });

  const content = isLoading
  ? <div className="loading">Loading...</div>
  : (<div className="units">{units}</div>);

  // finally, return everything
  return (
    <div className="unitspage">
      <header>
        <Link to="/" id="homelink">[ Home ]</Link> 
        <h3 className="units-title">{title}</h3>
      </header>
      <div className="max-wrapper">{content}</div>
    </div>
  
  );
};

export default UnitsPage;