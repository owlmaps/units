import { LazyLoadComponent } from 'react-lazy-load-image-component';

const UnitPatch = ({patch}: Patch) => {

  const encodedPatchPath = encodeURI(patch);
  const style={  
    backgroundImage: `url(${encodedPatchPath})`,
  }

  // return final image-box
  return (
    <LazyLoadComponent>
      <div className="unit-patch" style={style} />
    </LazyLoadComponent>
  );

};

export default UnitPatch;