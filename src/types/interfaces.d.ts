interface UnitsPage {
  who: string
}

interface Unit {
  name: string,
  parent?: string,
  meta?: MetaData,
  patches?: Array<Patch>,
  subunits?: Array<Unit>,
  level: number,
  compact?: boolean,
  searchmode?: boolean,
  parents?: Array<string>
}

interface MetaData {
  description?: string,
  facebook?: string,
  twitter?: string,
  telegram?: string,
  youtube?: string,
  tags?: string
}

interface Unitpatches {
  patches?: Array<Patch>
  compact?: boolean
}

interface PatchCompact {
  parents: Array<string>,
  patch: Patch;
  searchmode?: boolean,
}
interface Patch {
  thumb: string;
  full: string,
}

declare module 'react-modal-image';