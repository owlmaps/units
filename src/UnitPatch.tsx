import { LazyLoadComponent } from 'react-lazy-load-image-component';
import ModalImage from "react-modal-image";

const UnitPatch = (props: Patch) => {

  const { full, preview } = props;

  const encodedFullPath = encodeURI(full);
  const encodedPreviewPath = encodeURI(preview);

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

export default UnitPatch;