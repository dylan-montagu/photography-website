import React, { useState } from 'react';

import useProgressiveImg from '../util/useProgressiveImg';

const PhotoGalleryResponsiveImage = ({
  photo,
  onClick,
  margin,
  children,
  thumbnail,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  if (thumbnail) console.log(photo.urlThumbnail);
  const [src, { blur }] = useProgressiveImg(
    photo.urlSmall,
    thumbnail && photo.urlThumbnail ? photo.urlThumbnail : photo.urlMedium
  );

  // determine whether to blur low quality image
  if (!blur) {
    setTimeout(() => {
      setImgLoaded(true);
    }, 300);
  }

  const cont = {
    backgroundColor: imgLoaded ? '#fff' : '000',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <div
      className='container'
      style={{
        margin,
        height: photo.height,
        width: photo.width,
        ...cont,
      }}
    >
      <div className='img-wrapper'>
        <img
          loading='lazy'
          onClick={onClick}
          id={photo._id}
          alt={photo.description}
          src={src}
          width={photo.width}
          height={photo.height}
          // if low quality image use inline styles
          // if high quality has loaded, ignore inline styling to prevent over writing hover efects
          style={
            !imgLoaded
              ? {
                  filter: blur ? 'blur(20px)' : 'none',
                  transition: blur ? 'none' : 'filter 0.3s ease-out',
                }
              : {}
          }
        />
        {/* Children is for album elts that show reactive album title */}
        {children}
      </div>
    </div>
  );
};

export default PhotoGalleryResponsiveImage;
