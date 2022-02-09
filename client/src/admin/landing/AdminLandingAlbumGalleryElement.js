import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import PhotoGalleryResponsiveImage from '../../sharedComponents/PhotoGalleryResponsiveImage';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const AdminLandingAlbumGalleryElement = ({ album, margin }) => {
  return (
    <Fragment>
      {/* Link to AlbumPhotoGallery */}
      <Link to={`/admin/album/${album._id}`}>
        <PhotoGalleryResponsiveImage photo={album} margin={margin}>
          {
            <Box className='middle'>
              <Typography variant='h6' className='text'>
                {album.name}
              </Typography>
            </Box>
          }
        </PhotoGalleryResponsiveImage>
      </Link>
    </Fragment>
  );
};

export default AdminLandingAlbumGalleryElement;
