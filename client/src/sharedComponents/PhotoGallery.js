import React, { useCallback, Fragment } from 'react';

import Gallery from 'react-photo-gallery';

const AdminLandingGallery = ({
  photos,
  GalleryElement,
  margin,
  targetRowHeight,
  thumbnail,
}) => {
  const imageRenderer = useCallback(
    ({ index, left, top, key, photo }) => (
      <GalleryElement
        key={key}
        margin={margin}
        thumbnail={thumbnail}
        index={index}
        photo={photo}
        album={photo}
        left={left}
        top={top}
      />
    ),
    [margin, thumbnail]
  );

  return (
    <Fragment>
      <Gallery
        photos={photos}
        renderImage={imageRenderer}
        targetRowHeight={targetRowHeight}
      />
    </Fragment>
  );
};

export default AdminLandingGallery;
