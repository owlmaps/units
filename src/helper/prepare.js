import fs from 'node:fs';
import path from 'node:path';
import toml from 'toml';

// constants
const PUBLICPATH = './public';
const UNITSPATH = './public/units';
const ALLOWEDIMAGETYPES = ['.jpg', '.png', '.svg']

/**
 * 
 * @param {string} unitPath 
 * @returns {array} images - array of images
 */
const getImages = (unitPath) => {
  const images = [];
  fs.readdirSync(unitPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map((dirent) => {
      const ext = path.extname(dirent.name).toLowerCase();
      if(ALLOWEDIMAGETYPES.includes(ext)) {
        // to be sure, convert to unix path separators
        const imagePath = path
          .join(unitPath, dirent.name)
          .split(path.sep)
          .join(path.posix.sep)
          .replace(/^public\//, "");
        images.push(imagePath)
      }
  });
  return images;
}


/**
 * reads the content of a folder and returns
 * a sorted array of all subfolders
 * 
 * @param {string} aPath 
 * @returns {array} - sorted array of path strings
 */
const getSortedFolder = (aPath) => {
  // read folders inside path
  const allFolders = fs.readdirSync(aPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  // 1. sort all folders which starts with (ordinal) numbers
  // 2. concatenate filtered numeric units with unfiltered units
  const numericFolders = allFolders.filter(folderName => /^\d+/.test(folderName));
  const sortedNumericFolders = numericFolders.sort((fileA, fileB) => {
    const numA = parseInt(path.basename(fileA, path.extname(fileA)).match(/^\d+/)[0]);
    const numB = parseInt(path.basename(fileB, path.extname(fileB)).match(/^\d+/)[0]);
    return numA - numB;
  });
  // get all folders not starting with (ordinal) numbers
  const noneNumericFolders = allFolders.filter(folderName => !/^\d+/.test(folderName));
  // combine sorted numeric folder with non-numeric ones
  const sortedFolders = sortedNumericFolders.concat(noneNumericFolders);
  // return
  return sortedFolders;
}

/**
 * reads the content of the meta toml file
 * and returns its content or null
 * 
 * @param {string} aPath The path to the folder
 * @returns {object|null}
 */
const getMeta = (aPath) => {
  const tomlPath = path.join(aPath, '_meta.toml');
  if (fs.existsSync(tomlPath)) {
    const tomlContent = fs.readFileSync(tomlPath);
    const tomlData = toml.parse(tomlContent);
    return tomlData;
  }
  return null
}

/**
 * 
 * @param {string} aPath 
 * @returns {array} - sorted array of path strings
 */
const getSubsContent = (aPath) => {
  const subsPath = path.join(aPath, '_subunits');
  if (fs.existsSync(subsPath)) {
    return getSortedFolder(subsPath);
  }
  return [];
}

/**
 * gets the content of a folder
 * extract all needed data, in our case
 * name, metadata, patches and a subunit list
 * 
 * @param {string} unitPath 
 */
const getUnitContent = (unitPath, parent) => {
  // name from path
  const name = path.basename(unitPath);
  // get meta
  const meta = getMeta(unitPath);
  // get patches
  const patches = getImages(unitPath)
  // get subunit list
  const subunitList = getSubsContent(unitPath);
  // return
  return {
    name,
    parent,
    meta,
    patches,
    subunits: [],
    subunitList,
  }
}

const readUnit = (unitPath, unitLevel, parent) => {
  // increase the level
  unitLevel++;
  // get unit content
  const unitData = getUnitContent(unitPath, parent);
  // add level to unit
  unitData.level = unitLevel;
  // if we have subunits, check them
  if (unitData.subunitList.length > 0) {
    unitData.subunitList.forEach((subUnitFolder) => {
      const subUnitPath = path.join(unitPath, '_subunits', subUnitFolder);
      const subUnitData = readUnit(subUnitPath, unitLevel, unitData.name);
      // cleanup
      delete subUnitData.subunitList;
      // add to parent unit
      unitData.subunits.push(subUnitData);
    });
  }
  // clean unused data
  delete unitData.subunitList;
  if (unitData.patches.length === 0) {
    delete unitData.patches;
  }
  if (unitData.subunits.length === 0) {
    delete unitData.subunits;
  }
  // return
  return unitData;

}

/**
 * writes all unit data to a json file
 * 
 * @param {array} data - array of objects with unit data
 */
const writeData = (data) => {
  const outFile = path.join(PUBLICPATH, 'data.json');
  // fs.writeFileSync(outFile, JSON.stringify(data));
  fs.writeFileSync(outFile, JSON.stringify(data, null, 4));
}

/**
 * run
 */
const run = () => {
  // init data
  const data = [];
  // get parent units
  const parents = getSortedFolder(UNITSPATH);
  // read each parent (and its subunits)
  parents.forEach(parent => {
    const level = -1;
    const parentPath = path.join(UNITSPATH, parent);    
    const unitData = readUnit(parentPath, level);
    data.push(unitData);
  })
  // write data
  writeData(data);
}

run();


