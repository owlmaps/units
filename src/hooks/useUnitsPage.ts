import { useEffect, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';

interface UseUnitsPageProps {
  who: string;
}

interface UseUnitsPageReturn {
  // isLoading: boolean;
  filteredData: Unit[];
  query: string[];
  isCompactMode: boolean;
  baseUnits: baseUnit[];
  searchmode: boolean;
  title: string;
  compactModeText: string;
  resetButtonClass: string;
  onQueryChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  debouncedQueryHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetForm: () => void;
  onCompactMode: () => void;
  onHamburgerClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onHamburgerItemClick: () => void;
}

export const useUnitsPage = ({ who }: UseUnitsPageProps): UseUnitsPageReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Unit[]>([]);
  const [query, setQuery] = useState<string[]>([]);
  const [isCompactMode, setIsCompactMode] = useState(true);

  // Determine title and datafile based on 'who' prop
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

  // Query change handler
  const onQueryChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const aQuery = (e.target.value).toLocaleLowerCase();
    if (aQuery === '') {
      setQuery([]);
    } else {
      const queryWords = (e.target.value).toLocaleLowerCase().split(' ');
      setQuery(queryWords);
    }
  };

  // Debounced query handler
  const debouncedQueryHandler = useMemo(
    () => debounce(onQueryChangeHandler, 750),
    []
  );

  // Reset form
  const resetForm = () => {
    setQuery([]);
  };

  // Toggle compact mode
  const onCompactMode = () => {
    setIsCompactMode(!isCompactMode);
  };

  // Fetch data from JSON file
  const fetchData = () => {
    fetch(`./${datafile}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hamburger menu handlers
  const onHamburgerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    elem.classList.toggle('checked');
    const jumperContent = document.getElementById('jumpercontent');
    jumperContent?.classList.toggle('show');
  };

  const onHamburgerItemClick = () => {
    const hamburger = document.getElementById('hamburger');
    hamburger?.classList.toggle('checked');
    const jumperContent = document.getElementById('jumpercontent');
    jumperContent?.classList.toggle('show');
  };

  // Filter logic
  const queryCheck = (aString: string): boolean => {
    for (let i = 0; i < query.length; i++) {
      const pattern = new RegExp(query[i], 'g');
      if (!pattern.test(aString)) {
        return false; // one pattern not found, return false
      }
    }
    return true; // all found
  };

  const filterUnit = (unit: Unit): boolean => {
    const { name, subunits, meta, patches } = unit;
    // first go into the most nested unit and work your way up
    let filteredSubUnits: Unit[] = [];
    if (Array.isArray(subunits)) {
      filteredSubUnits = subunits.filter((subunit) => filterUnit(subunit));
    }
    // has the unit matching subunits
    const hasMatchingSubunits = filteredSubUnits.length > 0;
    unit.subunits = filteredSubUnits;
    // check the unit itself
    let isPatternInUnitName = false;
    let isPatternInTags = false;
    let isPatternInDescription = false;
    if (name) {
      isPatternInUnitName = queryCheck(name.toLocaleLowerCase()); // name check
    }
    if (meta && meta.description !== undefined) {
      isPatternInDescription = queryCheck(meta.description.toLocaleLowerCase()); // description check
    }
    if (meta && meta.tags !== undefined) {
      isPatternInTags = queryCheck(meta.tags.toLocaleLowerCase()); // tags check
    }
    const patternFound = isPatternInUnitName || isPatternInTags || isPatternInDescription;
    // in compact mode add an empty patch in case there was a pattern match
    // otherwise nothing would be shown
    if (isCompactMode && patternFound && !patches) {
      unit.patches = [{ full: 'images/unknown.jpg', thumb: 'images/unknown.jpg' }];
    }
    // if unit itself doesn't match, but has matching subunits
    // remove the units own features (patches, meta) and return true
    if (!patternFound && hasMatchingSubunits) {
      delete unit.patches;
      delete unit.meta;
      return true;
    }
    // If the unit itself has matches, just return true
    // otherwise return false
    return patternFound;
  };

  // Filter data based on query
  let filteredData = JSON.parse(JSON.stringify(data)) as Unit[]; // deep clone of the array of object

  if (query.length > 0) {
    filteredData = filteredData.filter(unit => filterUnit(unit));
  }

  // Generate base units for navigation
  const baseUnits: baseUnit[] = [];
  filteredData.forEach((unitData: Unit, idx) => {
    const baseUnit: baseUnit = {
      name: unitData.name,
      jumpKey: idx
    };
    baseUnits.push(baseUnit);
  });

  // Computed values
  const searchmode = query && query.length > 0;
  const compactModeText = isCompactMode ? 'Details' : 'Compact';
  const resetButtonClass = searchmode ? 'show' : 'hide';

  return {
    // isLoading,
    filteredData,
    query,
    isCompactMode,
    baseUnits,
    searchmode,
    title,
    compactModeText,
    resetButtonClass,
    onQueryChangeHandler,
    debouncedQueryHandler,
    resetForm,
    onCompactMode,
    onHamburgerClick,
    onHamburgerItemClick,
  };
};
