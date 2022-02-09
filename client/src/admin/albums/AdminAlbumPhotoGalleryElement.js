import React, { useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import useProgressiveImg from '../../util/useProgressiveImg';
import PhotoGalleryResponsiveImage from '../../sharedComponents/PhotoGalleryResponsiveImage';
import AdminAlbumGalleryElementDialog from './dialogs/AdminAlbumGalleryElementDialog';

import axios from 'axios';

const AdminGridPhoto = ({ photo, margin }) => {
  const history = useHistory();

  const [src] = useProgressiveImg(photo.urlSmall, photo.urlMedium);

  const [thumbnailPhotoUpdated, setThumbnailPhotoUpdated] = useState(false);

  const [editPhotoDialogOpen, setEditPhotoDialogOpen] = React.useState(false);

  const removePhotoFromAlbum = async () => {
    photo.removePhotoFromView(photo._id);

    try {
      await axios.delete(`/api/albums/${photo.parentAlbumId}/${photo._id}`);
    } catch (err) {
      console.error(err);
      alert('Photo was unable to be removed from album');
    }
  };

  const setThumbnailPhoto = async () => {
    try {
      axios.patch(`/api/albums/${photo.parentAlbumId}`, {
        thumbnailPhoto: photo._id,
      });
      setThumbnailPhotoUpdated(true);
      setTimeout(() => setThumbnailPhotoUpdated(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Fragment>
      <PhotoGalleryResponsiveImage
        photo={photo}
        onClick={() => setEditPhotoDialogOpen(true)}
        margin={margin}
      ></PhotoGalleryResponsiveImage>
      <AdminAlbumGalleryElementDialog
        photo={photo}
        open={editPhotoDialogOpen}
        handleClose={() => setEditPhotoDialogOpen(false)}
        src={src}
        history={history}
        setThumbnailPhoto={setThumbnailPhoto}
        thumbnailPhotoUpdated={thumbnailPhotoUpdated}
        removePhotoFromAlbum={removePhotoFromAlbum}
      ></AdminAlbumGalleryElementDialog>
    </Fragment>
  );
};

export default AdminGridPhoto;
