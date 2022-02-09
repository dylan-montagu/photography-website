import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import PhotoGalleryResponsiveImage from '../sharedComponents/PhotoGalleryResponsiveImage';

const Photo = ({ photo, margin }) => {
  return (
    <Fragment>
      <Link to={`/album/${photo.parentAlbumId}/${photo.indexInAlbum}`}>
        <PhotoGalleryResponsiveImage photo={photo} margin={margin} />
      </Link>
    </Fragment>
  );
};

export default Photo;
