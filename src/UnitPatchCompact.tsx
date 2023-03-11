import { LazyLoadComponent } from 'react-lazy-load-image-component';
import ModalImage from "react-modal-image";

const UnitPatchCompact = (props: PatchCompact) => {
  const { patch, parents } = props;
  const { thumb, full } = patch;

  const encodedFullPath = encodeURI(full);
  const encodedThumbnailPath = encodeURI(thumb);
  const tooltipHTML = parents.join('<br />');

  // return final image-box
  return (
    <LazyLoadComponent>
      <span className="thumbnail-wrapper patch-tooltip" data-tooltip-html={tooltipHTML}>
      <ModalImage 
      small={encodedThumbnailPath}
      large={encodedFullPath}
      className="patch-image"
      imageBackgroundColor="#ffffff"
      data-tooltip-html={tooltipHTML}
      ></ModalImage>
      </span>
    </LazyLoadComponent>
  );
};

export default UnitPatchCompact;