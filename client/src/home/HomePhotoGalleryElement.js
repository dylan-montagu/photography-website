import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';

import useProgressiveImg from '../util/useProgressiveImg';

const Photo = ({ photo, margin, index }) => {
  const [src, { blur }] = useProgressiveImg(photo.urlSmall, photo.urlMedium);
  const [imgLoaded, setImgLoaded] = useState(false);

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
    <Fragment>
      {/* Link to PhotoView */}
      <Link to={`/index/${index}`}>
        <div
          className='container'
          style={{
            // ...imgStyle,
            margin,
            height: photo.height,
            width: photo.width,
            ...cont,
          }}
        >
          <div className='img-wrapper'>
            <img
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
          </div>
        </div>
      </Link>
    </Fragment>
  );
};

export default Photo;
