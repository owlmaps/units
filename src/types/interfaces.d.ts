interface Unit {
  name: string,
  parent?: string,
  meta?: MetaData,
  patches?: Array<string>,
  subunits?: Array<Unit>,
  level: number
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