import React from 'react';
import { Link } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import Unit from '../Unit';
import { Tooltip } from 'react-tooltip';
import { HashLink } from 'react-router-hash-link';
import { useUnitsPage } from '../hooks/useUnitsPage';

const UnitsPage = (props: UnitsPage) => {
  const {
    // isLoading,
    filteredData,
    isCompactMode,
    baseUnits,
    searchmode,
    title,
    compactModeText,
    resetButtonClass,
    debouncedQueryHandler,
    resetForm,
    onCompactMode,
    onHamburgerClick,
    onHamburgerItemClick,
  } = useUnitsPage({ who: props.who });

  // Generate all unit components
  const units = filteredData.map((unitData: Unit, idx) => {
    const jumpKey = `cat-${idx}`;
    return (
      <div key={idx} id={jumpKey} className="unit-wrapper">
        <Unit {...unitData} compact={isCompactMode} searchmode={searchmode} />
      </div>
    );
  });

  const jumperContent = baseUnits.map((bu, idx) => {
    const jumperKey = `cat-${bu.jumpKey}`;
    return (
      <HashLink
        key={idx}
        to={`#${jumperKey}`}
        className="jumper-item"
        onClick={onHamburgerItemClick}
      >
        {bu.name}
      </HashLink>
    );
  });

  // TODO: add loading state
  // const content = isLoading
  //   ? <div className="loading">Loading...</div>
  //   : (<div className="units">{units}</div>);

  // finally, return everything
  return (
    <div className="unitspage">
      <header>
        <Link to="/" id="homelink">[ Home ]</Link>
        <h3 className="units-title">{title}</h3>
        <button id="compactmode" onClick={onCompactMode}>[ {compactModeText} ]</button>
      </header>
      <div id="opbox">
        <div id="filterbox">Filter Units:
          <form>
            <input type="text" onChange={debouncedQueryHandler} placeholder="type a query" />
            <button type="reset" className={resetButtonClass} onClick={() => resetForm()}>&times;</button>
          </form>
        </div>
        <div id="helpbox"><a href="https://twitter.com/intent/tweet?text=@UAControlMap" target="_blank">Tweet us to report any corrections/mistakes/additions</a></div>
        <div id="jumperbox">
          <div id="hamburger" onClick={onHamburgerClick}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <div id="jumpercontent">{jumperContent}</div>
        </div>
      </div>
      <div className='scrollbox'>
        <div className="max-wrapper">{units}</div>
      </div>
      <Tooltip anchorSelect=".patch-tooltip" id="patch-tooltip" />
    </div>

  );
};

export default UnitsPage;