interface UnitsPage {
  who: string
}

interface Unit {
  name: string,
  parent?: string,
  meta?: MetaData,
  patches?: Array<string>,
  subunits?: Array<Unit>,
  level: number,
  compact?: boolean,
  parents?: Array<string>
}

interface MetaData {
  description?: string,
  facebook?: string,
  twitter?: string,
  telegram?: string,
  youtube?: string
}

interface Patches {
  patches?: Array<string>;
}
interface Patch {
  patch: string;
}
interface PatchCompact {
  parents: Array<string>,
  patch: string;
}