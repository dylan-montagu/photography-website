import React from 'react';
import { Link } from 'react-router-dom';

import PhotoGalleryResponsiveImage from '../../sharedComponents/PhotoGalleryResponsiveImage';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const AdminLandingAllAlbumsPhotoGalleryElement = ({ photo, margin }) => {
  return (
    <Link to={`/admin/album/${photo._id}`}>
      <div>
        <PhotoGalleryResponsiveImage photo={photo} margin={margin}>
          {
            <Box className='middle'>
              <Typography variant='h6' className='text'>
                {photo.name}
              </Typography>
            </Box>
          }
        </PhotoGalleryResponsiveImage>
      </div>
    </Link>
  );
};

export default AdminLandingAllAlbumsPhotoGalleryElement;
