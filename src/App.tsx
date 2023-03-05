import React, { useEffect, useState } from 'react';
import Unit from './Unit';

const App = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch('./data.json')
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
  }

  useEffect(() => {
    fetchData();
  }, [])

  // show loading mesage, while fetching data
  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

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

  // finally, return everything
  return <div className="units">{units}</div>;
};

export default App;