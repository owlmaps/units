import { LazyLoadComponent } from 'react-lazy-load-image-component';
import ModalImage from "react-modal-image";

const UnitPatch = (props: Patch) => {

  let { thumb, full } = props;

  const encodedFullPath = encodeURI(full);
  const encodedThumbnailPath = encodeURI(thumb);

  // return final image-box
  return (
    <LazyLoadComponent>
      <span className="thumbnail-wrapper">
      <ModalImage 
      small={encodedThumbnailPath}
      large={encodedFullPath}
      className="patch-image"
      imageBackgroundColor="#ffffff"
      ></ModalImage>
      </span>
    </LazyLoadComponent>
  );

};

export default UnitPatch;