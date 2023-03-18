import { LazyLoadComponent } from 'react-lazy-load-image-component';
import ModalImage from "react-modal-image";

const UnitPatchCompact = (props: PatchCompact) => {
  const { patch, parents, searchmode } = props;
  const { thumb, full } = patch;

  const encodedFullPath = encodeURI(full);
  const encodedThumbnailPath = encodeURI(thumb);
  const tooltipHTML = parents.join('<br />');

  // only display unknown patches if we are in
  // search mode
  // console.log(patch, searchmode)
  if (thumb === 'images/unknown.jpg' && !searchmode) {
    return null;
  }

  // return final image-box
  return (
    <LazyLoadComponent>
      <span className="thumbnail-wrapper patch-tooltip" data-tooltip-html={tooltipHTML}>
      <ModalImage 
      small={encodedThumbnailPath}
      large={encodedFullPath}
      className="patch-image patch-image-compact"
      imageBackgroundColor="#ffffff"
      data-tooltip-html={tooltipHTML}
      ></ModalImage>
      </span>
    </LazyLoadComponent>
  );
};

export default UnitPatchCompact;