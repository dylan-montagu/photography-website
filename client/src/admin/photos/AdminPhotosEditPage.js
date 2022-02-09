import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import AdminPhotosEditPageGalleryElement from './AdminPhotosEditPageGalleryElement';
import PhotoGallery from '../../sharedComponents/PhotoGallery';
import { useAlertContext } from '../../AlertContext';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  return {
    sectionDesktop: {
      paddingLeft: '20px',
      [theme.breakpoints.down('xs')]: {
        fontSize: '1.25rem',
      },
      '@media (max-width:420px)': {
        fontSize: '1.05rem',
      },
      fontWeight: 400,
      color: theme.palette.primary[50],
    },
    editButton: {
      marginRight: 10,
      marginBottom: 10,
    },
  };
});

export const AdminPhotosEditPage = () => {
  const imageRef = useRef(null);
  const alertContext = useAlertContext();

  const classes = useStyles();
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState();
  const [previewPhoto, setPreviewPhoto] = useState();

  const getPhotos = async () => {
    try {
      const res = await axios.get('/api/photos');
      res.data.forEach((photo) => {
        photo.src = photo._id;
      });
      setPhotos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPhotos();
  }, []);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!file) {
      setPreviewPhoto(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewPhoto(objectUrl);
    return () => URL.revokeObjectURL(objectUrl); // free memory when ever this component is unmounted
  }, [file]);

  const uploadPhoto = async () => {
    let formData = new FormData();
    formData.append('image', imageRef.current.files[0]);
    const config = {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    };
    try {
      await axios.post('/api/photos', formData, config);
      getPhotos();
    } catch (err) {
      alertContext.openAlert('Error Uploading Photo', err.response.data.msg);
      console.error(err);
    }
  };

  return (
    <div>
      <Button
        className={classes.editButton}
        style={{ marginBottom: 30 }}
        variant='outlined'
        component={Link}
        to={`/admin`}
      >
        {'<- Back to Admin Console'}
      </Button>
      <div>
        <Button
          className={classes.editButton}
          variant='outlined'
          component='label'
        >
          Choose File
          <input
            id='files'
            type='file'
            hidden
            onChange={(e) => setFile(e.target.files[0])}
            ref={imageRef}
          />
        </Button>
        {file && (
          <img src={previewPhoto} width='200' height='auto' alt={file.name} />
        )}
      </div>
      <div>
        {file ? (
          <Typography color='primary'>{file.name}</Typography>
        ) : undefined}
      </div>
      <Button
        className={classes.editButton}
        variant='outlined'
        onClick={uploadPhoto}
      >
        CONFIRM UPLOAD
      </Button>
      <PhotoGallery
        photos={photos}
        GalleryElement={AdminPhotosEditPageGalleryElement}
        margin='2px'
        targetRowHeight={100}
        thumbnail={true}
      />
    </div>
  );
};

export default AdminPhotosEditPage;
