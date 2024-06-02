import fs from 'node:fs';
import path from 'node:path';
import toml from 'toml';
import sharp from 'sharp';
import { sha256 } from 'crypto-hash';

// constants
const PUBLICPATH = './public';
const THUMBNAILPATH = './public/images/patches/thumb';
const FULLIMAGEPATH = './public/images/patches/full';
const UNITSPATH_UA = './data/units-ua';
const UNITSPATH_RU = './data/units-ru';
const ALLOWEDIMAGETYPES = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.jfif']
// image processing options
const THUMBNAIL_OPTIONS = {
  height: 70,
  width: null
}
const OPTIMIZE_OPTIONS = {
  quality: 75
}
// a list of all generated image hashes
const imageHashes = [];

const imagePathToPosix = (aPath) => {
  return path
    .join(aPath)
    .split(path.sep)
    .join(path.posix.sep)
    .replace(/^public\//, "");
}


// create a thumbnail and a jpg (80% quality with orig size)
const processImage = async (sourcePath) => {
  // read file content and create hash
  const fileContent = fs.readFileSync(sourcePath, 'utf8');
  const hash = await sha256(fileContent);
  imageHashes.push(hash); // add hash to global list
  // targetPaths
  const thumbnailPath = path.join(THUMBNAILPATH, `${hash}.jpg`);
  const fullImagePath = path.join(FULLIMAGEPATH, `${hash}.jpg`);
  // to be sure, convert to unix path separators
  const thumbnailPathPosix = imagePathToPosix(thumbnailPath)
  const fullImagePathPosix = imagePathToPosix(fullImagePath)
  // check if we already have this file
  if (fs.existsSync(thumbnailPath) && fs.existsSync(fullImagePath)) {
    return {
      thumb: thumbnailPathPosix,
      full: fullImagePathPosix
    }
  }
  console.log(`New image: ${sourcePath}`);
  // else - convert images
  // process image
  if (fs.existsSync(sourcePath)) {   
    await sharp(sourcePath)
    .flatten({ background: '#ffffff' })
    .jpeg(OPTIMIZE_OPTIONS)
    .toFile(fullImagePath);
    await sharp(sourcePath)
    .flatten({ background: '#ffffff' })
    .resize(THUMBNAIL_OPTIONS)
    .toFile(thumbnailPath);
  }
  return {
    thumb: thumbnailPathPosix,
    full: fullImagePathPosix
  }
}


/**
 * 
 * @param {string} unitPath 
 * @returns {array} images - array of images
 */
const getImages = async (unitPath) => {
  const images = [];
  const filteredImages = fs.readdirSync(unitPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .filter(dirent => {
      const ext = path.extname(dirent.name).toLowerCase();
      return ALLOWEDIMAGETYPES.includes(ext);
    });


  try {
    for (let i = 0; i < filteredImages.length; i++) {
      const dirent = filteredImages[i];
      const sourceImagePath = path.join(unitPath, dirent.name);
      const imageData = await processImage(sourceImagePath);
      images.push(imageData);
    }
  } catch (error) {
    console.log(error);
    return images;
  }



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
    try {
      const tomlContent = fs.readFileSync(tomlPath);
      const tomlData = toml.parse(tomlContent);
      // clean empty fields
      const metaList = Object.entries(tomlData)
        .filter(([_, v]) => v !== "");
      if (metaList.length === 0) {
        return null;
      }
      const meta = metaList.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
      return meta;
    } catch (error) {
      console.log(error);
      console.log(tomlPath);
      throw Error('TOML ERROR');
    }

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
const getUnitContent = async (unitPath, parent) => {
  // name from path
  const name = path.basename(unitPath);
  // get meta
  const meta = getMeta(unitPath);
  // get patches
  const patches = await getImages(unitPath);
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

const readUnit = async (unitPath, unitLevel, parent) => {
  // increase the level
  unitLevel++;
  // get unit content
  const unitData = await getUnitContent(unitPath, parent);
  // add level to unit
  unitData.level = unitLevel;
  // if we have subunits, check them
  if (unitData.subunitList.length > 0) {
    for (const subUnitFolder of unitData.subunitList) {
      const subUnitPath = path.join(unitPath, '_subunits', subUnitFolder);
      const subUnitData = await readUnit(subUnitPath, unitLevel, unitData.name);
      // cleanup
      delete subUnitData.subunitList;
      // add to parent unit
      unitData.subunits.push(subUnitData);
    }
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
const writeData = (outFile, data) => {  
  fs.writeFileSync(outFile, JSON.stringify(data, null, 4));
}

const initImageFolder = () => {
  // create folder if not exist
  if (!fs.existsSync(THUMBNAILPATH)) {
    fs.mkdirSync(THUMBNAILPATH ,{ recursive: true });
  }
  if (!fs.existsSync(FULLIMAGEPATH)) {
    fs.mkdirSync(FULLIMAGEPATH, { recursive: true });
  }
}


/**
 * run
 */
const run = async (who) => {
  let unitspath = '';
  if (who === 'ua')  {
    unitspath = UNITSPATH_UA;
  } else if (who === 'ru') {
    unitspath = UNITSPATH_RU;
  } else {
    return;
  }
  
  // init data
  const data = [];
  // get parent units
  const parents = getSortedFolder(unitspath);
  // read each parent (and its subunits)
  for (const parent of parents) {
    const level = -1;
    const parentPath = path.join(unitspath, parent);    
    const unitData = await readUnit(parentPath, level);
    data.push(unitData);
  }
  // write data
  const outFile = path.join(PUBLICPATH, `${who}.json`);
  writeData(outFile, data);
}

const cleanOldHashFiles = () => {

  const thumbnailHashes = fs.readdirSync(THUMBNAILPATH, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => path.parse(dirent.name).name);
  const fullImageHashes = fs.readdirSync(FULLIMAGEPATH, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => path.parse(dirent.name).name);

  console.log(`Generated ${imageHashes.length} hashes`);
  console.log(`Found ${thumbnailHashes.length} hash thumbnails`);
  console.log(`Found ${fullImageHashes.length} hash full images`);

  // find obsolete files
  const obsoleteHashes1 = thumbnailHashes.filter(x => imageHashes.indexOf(x) === -1);
  const obsoleteHashes2 = fullImageHashes.filter(x => imageHashes.indexOf(x) === -1);

  console.log(`Found ${obsoleteHashes1.length} obsolete thumbnail files.`);
  console.log(`Found ${obsoleteHashes2.length} obsolete full image files.`);

  // delete them
  for (let i = 0; i < obsoleteHashes1.length; i++) {
    const hash = obsoleteHashes1[i];
    const filePath = path.join(THUMBNAILPATH, `${hash}.jpg`);
    fs.unlinkSync(filePath);    
  }
  for (let i = 0; i < obsoleteHashes2.length; i++) {
    const hash = obsoleteHashes2[i];
    const filePath = path.join(FULLIMAGEPATH, `${hash}.jpg`);
    fs.unlinkSync(filePath);    
  }

}


(async () => {
  // preparations
  initImageFolder();
  await run('ua');
  await run('ru');
  cleanOldHashFiles();
})()

