import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

import useProgressiveImg from '../../util/useProgressiveImg';
import { useAlertContext } from '../../AlertContext';
import DeletePhotoDialog from './dialogs/DeletePhotoDialog';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  albumTitle: {
    paddingBottom: '20px',
    fontSize: '1.6rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.05rem',
    },
    '@media (max-width:420px)': {
      fontSize: '0.85rem',
    },
    textDecoration: 'none',
    color: 'dddddd',
  },
  iconButton: {
    color: '#383838',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180,
  },
  formControlRemove: {
    margin: theme.spacing(1),
    minWidth: 210,
  },
  editButton: {},
}));

const AdminPhotoGalleryPhotoEditFocusView = ({ match }) => {
  const classes = useStyles();
  const history = useHistory();
  const alertContext = useAlertContext();

  const [photo, setPhoto] = useState({});
  const [albumsAddedTo, setAlbumsAddedTo] = useState([]);
  const [albumsNotAddedTo, setAlbumsNotAddedTo] = useState([]);
  const [albumToAddTo, setAlbumToAddTo] = useState('');
  const [albumToRemoveFrom, setAlbumToRemoveFrom] = useState('');
  const [offsetHeight, setOffsetHeight] = useState(0);
  const [photoDescription, setPhotoDescription] = useState('');
  const [displayRemovePhotoConfirmation, setDisplayRemovePhotoConfirmation] =
    useState(false);
  const [displayAddPhotoConfirmation, setDisplayAddPhotoConfirmation] =
    useState(false);
  const [deletePhotoDialogisOpen, setDeletePhotoDialogisOpen] = useState(false);

  const [src, { blur }] = useProgressiveImg(photo.urlSmall, photo.urlMedium);

  const getPhotoInfo = async (photoId) => {
    try {
      const photoRes = await axios.get(`/api/photos/${photoId}`);
      const albumRes = await axios.get('/api/albums/');
      setPhoto(photoRes.data);
      setPhotoDescription(photoRes.data.description);
      setAlbumsAddedTo(photoRes.data.albums);
      setAlbumsNotAddedTo(
        albumRes.data.filter((album) => {
          return !(
            photoRes.data.albums.filter((e) => e._id === album._id).length > 0
          );
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPhotoInfo(match.params.id);
    setOffsetHeight(document.getElementById('header').offsetHeight);
  }, [match.params.id]);

  const deletePhoto = async () => {
    try {
      await axios.delete(`/api/photos/${match.params.id}`);
      getPhotoInfo(match.params.id);
      history.push('/admin/photos');
    } catch (err) {
      alertContext.openAlert('Error deleting photo', err.response.data.msg);
      handleDeletePhotoDialogClose();
      console.error(err);
    }
  };

  const handleAddPhotoToAlbum = async () => {
    try {
      await axios.put(`/api/albums/${albumToAddTo}/${match.params.id}`);
      setAlbumToAddTo('');
      setDisplayAddPhotoConfirmation(true);
      getPhotoInfo(match.params.id);
      setTimeout(() => setDisplayAddPhotoConfirmation(false), 1000);
    } catch (err) {
      alertContext.openAlert(
        `Error adding photo to album`,
        err.response.data.msg
      );
      console.error(err);
    }
  };

  const handleRemovePhotoFromAlbum = async () => {
    try {
      await axios.delete(`/api/albums/${albumToRemoveFrom}/${match.params.id}`);
      setAlbumToRemoveFrom('');
      setDisplayRemovePhotoConfirmation(true);
      getPhotoInfo(match.params.id);
      setTimeout(() => setDisplayRemovePhotoConfirmation(false), 1000);
    } catch (err) {
      alertContext.openAlert(
        `Error removing photo from album`,
        err.response.data.msg
      );
      console.error(err);
    }
  };

  const handleUpdatePhotoDescription = async () => {
    try {
      await axios.patch(`/api/photos/${match.params.id}`, {
        description: photoDescription,
      });
      getPhotoInfo(match.params.id);
      setTimeout(() => setDisplayRemovePhotoConfirmation(false), 1000);
    } catch (err) {
      alertContext.openAlert(
        `Error updating photo description`,
        err.response.data.msg
      );
      console.error(err);
    }
  };

  const handleDeletePhotoDialogClose = () => {
    setDeletePhotoDialogisOpen(false);
  };

  return (
    <div>
      <Button variant='outlined' component={Link} to={`/admin/photos`}>
        {'<- Back to all photos'}
      </Button>
      <div>
        <Typography
          id='photo-title'
          className={classes.albumTitle}
          align='center'
          variant='h5'
        ></Typography>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={6}>
            <img
              style={{
                width: '100%',
                maxHeight: window.innerHeight * 0.95 - offsetHeight,
                objectFit: 'contain',
                filter: blur ? 'blur(20px)' : 'none',
                transition: blur ? 'none' : 'filter 0.3s ease-out',
              }}
              alt='temp'
              src={src}
            ></img>
          </Grid>
          <Grid item xs={6}>
            <div>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor='grouped-select'>
                  Add photo to album
                </InputLabel>
                <Select
                  defaultValue=''
                  id='grouped-select'
                  onChange={(e) => setAlbumToAddTo(e.target.value)}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {albumsNotAddedTo.map((album) => (
                    <MenuItem key={album._id} value={album._id}>
                      {album.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <Button
                className={classes.editButton}
                variant='outlined'
                disabled={!albumToAddTo}
                onClick={handleAddPhotoToAlbum}
              >
                Confirm Add
              </Button>
            </div>
            {displayAddPhotoConfirmation && (
              <Typography>PHOTO ADDED</Typography>
            )}
            <div>
              <FormControl className={classes.formControlRemove}>
                <InputLabel htmlFor='grouped-select'>
                  Remove photo from album
                </InputLabel>
                <Select
                  defaultValue=''
                  id='grouped-select'
                  onChange={(e) => setAlbumToRemoveFrom(e.target.value)}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {albumsAddedTo.map((album) => (
                    <MenuItem key={album._id} value={album._id}>
                      {album.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <Button
                variant='outlined'
                onClick={handleRemovePhotoFromAlbum}
                disabled={!albumToRemoveFrom}
              >
                Confirm Remove
              </Button>
            </div>
            {displayRemovePhotoConfirmation && (
              <Typography>PHOTO REMOVED</Typography>
            )}
            <div>
              <TextField
                style={{ width: 400, marginBottom: 10, marginTop: 10 }}
                label='Description'
                defaultValue={photoDescription}
                value={photoDescription}
                onChange={(e) => setPhotoDescription(e.target.value)}
              />

              <Button
                className={classes.editButton}
                variant='outlined'
                onClick={handleUpdatePhotoDescription}
                disabled={
                  photoDescription === photo.description || !photoDescription
                }
              >
                Confirm Description Change
              </Button>
            </div>
            <div>
              <Button
                style={{ marginTop: 30 }}
                variant='outlined'
                color='secondary'
                onClick={() => setDeletePhotoDialogisOpen(true)}
              >
                Delete Photo
              </Button>
              <DeletePhotoDialog
                photo={photo}
                deletePhotoDialogisOpen={deletePhotoDialogisOpen}
                handleDeletePhotoDialogClose={handleDeletePhotoDialogClose}
                handleDeletePhoto={deletePhoto}
              ></DeletePhotoDialog>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className='delete-button' />
    </div>
  );
};

export default AdminPhotoGalleryPhotoEditFocusView;
