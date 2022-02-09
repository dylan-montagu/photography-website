import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import PhotoGalleryResponsiveImage from '../sharedComponents/PhotoGalleryResponsiveImage';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const Album = ({ album, margin }) => {
  return (
    <Fragment>
      <Link to={`/album/${album._id}`}>
        <PhotoGalleryResponsiveImage photo={album} margin={margin}>
          <Box className='middle'>
            <Typography variant='h6' className='text'>
              {album.name}
            </Typography>
          </Box>
        </PhotoGalleryResponsiveImage>
      </Link>
    </Fragment>
  );
};

export default Album;
