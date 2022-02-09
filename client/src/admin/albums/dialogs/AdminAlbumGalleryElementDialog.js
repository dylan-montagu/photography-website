import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const AdminAlbumGalleryElementDialog = ({
  photo,
  open,
  handleClose,
  src,
  setThumbnailPhoto,
  thumbnailPhotoUpdated,
  removePhotoFromAlbum,
}) => {
  return (
    <Fragment>
      <Dialog open={open} onClose={handleClose} maxWidth='md'>
        <DialogTitle>Selected Photo: {photo.name}</DialogTitle>
        <img
          src={src}
          style={{
            height: 250,
            width: (photo.width / photo.height) * 250,
            padding: '20px',
          }}
          alt={photo.description}
        ></img>
        <DialogContent>
          <Button variant='outlined' onClick={setThumbnailPhoto}>
            Set as album thumbnail photo
          </Button>{' '}
          <Typography color='primary'>
            {thumbnailPhotoUpdated && 'Thumbnail Photo Updated'}
          </Typography>
        </DialogContent>
        <DialogContent>
          <Button
            variant='outlined'
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you wish to remove this photo from the album?'
                )
              )
                removePhotoFromAlbum();
            }}
          >
            Remove photo from album
          </Button>
        </DialogContent>
        <DialogContent>
          <Button
            variant='outlined'
            component={Link}
            to={`/admin/photos/${photo._id}`}
          >
            Edit photo
          </Button>
        </DialogContent>

        <DialogActions>
          <Button variant='text' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default AdminAlbumGalleryElementDialog;
