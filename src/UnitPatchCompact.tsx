import { LazyLoadComponent } from 'react-lazy-load-image-component';
import ModalImage from "react-modal-image";

const UnitPatchCompact = (props: PatchCompact) => {
  const { patch, parents } = props;
  const { preview, full } = patch;

  const encodedFullPath = encodeURI(full);
  const encodedPreviewPath = encodeURI(preview);
  const tooltipHTML = parents.join('<br />');

  const zoomImg = {
    src: encodedFullPath,
  }

  // return final image-box
  return (
    <LazyLoadComponent>
      <ModalImage 
      small={encodedPreviewPath}
      large={encodedFullPath}
      className="patch-image"
      imageBackgroundColor="#ffffff"
      ></ModalImage>
    </LazyLoadComponent>
  );
};

export default UnitPatchCompact;