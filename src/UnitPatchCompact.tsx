import { LazyLoadComponent } from 'react-lazy-load-image-component';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const UnitPatchCompact = (patchobj: PatchCompact) => {
  const { parents, patch } = patchobj;

  const encodedPatchPath = encodeURI(patch);
  const style={  
    backgroundImage: `url(${encodedPatchPath})`,
  }

  const tooltipHTML = parents.join('<br />');

  // return final image-box
  return (
    <LazyLoadComponent>
      <Zoom>
        <img
          alt="patch"
          src={encodedPatchPath}
          className="patch-image"
          data-tooltip-html={tooltipHTML}
        />
      </Zoom>
    </LazyLoadComponent>
  );

};

export default UnitPatchCompact;