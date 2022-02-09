import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import PhotoGalleryResponsiveImage from '../../sharedComponents/PhotoGalleryResponsiveImage';

const AdminPhotoGalleryPhoto = ({ photo, margin, thumbnail }) => {
  return (
    <Fragment>
      {/* Link to PhotoView */}
      <Link to={`/admin/photos/${photo._id}`}>
        <PhotoGalleryResponsiveImage
          photo={photo}
          margin={margin}
          thumbnail={thumbnail}
        />
      </Link>
    </Fragment>
  );
};

export default AdminPhotoGalleryPhoto;
