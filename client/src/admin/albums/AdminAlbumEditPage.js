import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import AdminAlbumPhotoGallery from './AdminAlbumPhotoGallery';
import AdminListView from './AdminListView';
import { useAlertContext } from '../../AlertContext';

import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Button from '@material-ui/core/Button';
import ChangeAlbumNameDialog from './dialogs/ChangeAlbumNameDialog';
import DeleteAlbumDialog from './dialogs/DeleteAlbumDialog';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toggleButton: {
    backgroundColor: theme.palette.primary[50],
    marginBottom: '20px',
    color: theme.palette.primary[50],
  },
  editButton: {
    marginTop: 10,
  },
}));

const AdminAlbumView = ({ match }) => {
  const classes = useStyles();
  const history = useHistory();
  const alertContext = useAlertContext();

  const [view, setView] = useState('grid');
  const [photos, setPhotos] = useState([]);
  const [album, setAlbum] = useState({});
  const [confirmation, setConfirmation] = useState(false);
  const [updatedAlbumName, setUpdatedAlbumName] = useState('');
  const [deleteAlbumDialogOpen, setDeleteAlbumDialogOpen] = useState(false);
  const [changeAlbumNameOpen, setChangeAlbumNameOpen] = useState(false);
  const [albumInLibrary, setAlbumInLibrary] = useState(false);
  const [libraryId, setLibraryId] = useState();

  const addAlbumToLibrary = async () => {
    try {
      await axios.put(`/api/library/${libraryId}/${match.params.id}`);
      setAlbumInLibrary(true);
      getPhotos(match.params.id);
    } catch (err) {
      alertContext.openAlert(
        'Error adding album to library',
        err.response.data.msg
      );
      console.error(err);
    }
  };

  const remomveAlbumFromLibrary = async () => {
    try {
      await axios.delete(`/api/library/${libraryId}/${match.params.id}`);
      setAlbumInLibrary(false);
      getPhotos(match.params.id);
    } catch (err) {
      alertContext.openAlert(
        'Error removing album from library',
        err.response.data.msg
      );
      console.error(err);
    }
  };

  const handleViewChange = (e, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleChangeAlbumNameClickOpen = () => {
    setChangeAlbumNameOpen(true);
  };

  const handleChangeAlbumNameClickClose = () => {
    setChangeAlbumNameOpen(false);
  };

  const handleDeleteAlbumClickOpen = () => {
    setDeleteAlbumDialogOpen(true);
  };

  const handleDeleteAlbumClickClose = () => {
    setDeleteAlbumDialogOpen(false);
  };

  const getPhotos = async (albumId) => {
    const res = await axios.get('/api/albums/' + albumId);
    const nPhotos = res.data.photos.length;
    res.data.photos.forEach((photo, index) => {
      photo.key = photo.AWSFilename;
      photo.parentAlbumId = albumId;
      photo.indexInAlbum = index;
      photo.albumLength = nPhotos;
      photo.listWidth = photo.width;
      photo.listHeight = photo.height;
      photo.src = photo._id;
    });
    setPhotos(res.data.photos);
    setAlbum(res.data);

    const libraryRes = await axios.get('/api/library/name/default');
    setLibraryId(libraryRes.data._id);
    if (!libraryRes.data.albums.filter((e) => e._id === albumId).length > 0) {
      setAlbumInLibrary(true);
    } else {
      setAlbumInLibrary(false);
    }
  };

  useEffect(() => {
    const albumId = match.params.id;
    getPhotos(albumId);
  }, [match.params.id, albumInLibrary]);

  const handleConfirmPhotoReordering = async () => {
    const photoIds = photos.map((photo) => {
      return photo._id;
    });
    try {
      await axios.patch(`/api/albums/${match.params.id}`, {
        photos: photoIds,
      });
      setConfirmation(true);
      setTimeout(() => setConfirmation(false), 2000);
    } catch (err) {
      console.error(err);
      alertContext.openAlert(
        'Error confirming photo arrangement',
        err.response.data.msg
      );
    }
  };

  const handleUpdateAlbumName = async () => {
    try {
      await axios.patch(`/api/albums/${match.params.id}`, {
        name: updatedAlbumName,
      });
    } catch (err) {
      alertContext.openAlert(
        'Error changing albums name',
        err.response.data.msg
      );
      console.error(err);
    }
    getPhotos(match.params.id);
    handleChangeAlbumNameClickClose();
  };

  const SubmitButton = () => {
    return (
      <Fragment>
        <Button
          variant='outlined'
          className={classes.editButton}
          onClick={handleConfirmPhotoReordering}
        >
          Confirm Photo Arrangement
        </Button>
        <Typography>{confirmation && 'Arrangement Updated'}</Typography>
      </Fragment>
    );
  };

  const deleteAlbum = async () => {
    try {
      await axios.delete(`/api/albums/${match.params.id}`);
      history.push(`/admin/`);
    } catch (err) {
      alertContext.openAlert(
        'Error deleting this album',
        err.response.data.msg
      );
      console.log(err.response);
      handleDeleteAlbumClickClose();
    }
  };

  return (
    <Fragment>
      <Typography align='center' variant='h4' style={{ padding: '20px' }}>
        {album.name}
      </Typography>
      <Button variant='outlined' component={Link} to={`/admin`}>
        {'<- Back to Admin Console'}
      </Button>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <ToggleButtonGroup
          className={classes.toggleButton}
          color='primary'
          value={view}
          exclusive
          onChange={handleViewChange}
          size='small'
        >
          <ToggleButton value='grid'>Grid</ToggleButton>
          <ToggleButton value='list'>List</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {view === 'grid' ? (
        <AdminAlbumPhotoGallery
          photos={photos}
          setPhotos={setPhotos}
          getPhotos={getPhotos}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AdminListView photos={photos} setPhotos={setPhotos} />
        </Box>
      )}
      <SubmitButton />
      <div>
        {albumInLibrary ? (
          <Button
            className={classes.editButton}
            variant='outlined'
            onClick={addAlbumToLibrary}
          >
            Add Album to Library
          </Button>
        ) : (
          <Button
            className={classes.editButton}
            variant='outlined'
            onClick={remomveAlbumFromLibrary}
          >
            Remove Album from Library
          </Button>
        )}
      </div>
      <Button
        className={classes.editButton}
        variant='outlined'
        onClick={handleChangeAlbumNameClickOpen}
      >
        Change Album Name
      </Button>
      <ChangeAlbumNameDialog
        album={album}
        setUpdatedAlbumName={setUpdatedAlbumName}
        handleUpdateAlbumName={handleUpdateAlbumName}
        changeAlbumNameOpen={changeAlbumNameOpen}
        handleChangeAlbumNameClickClose={handleChangeAlbumNameClickClose}
      ></ChangeAlbumNameDialog>
      <div>
        <Button
          className={classes.editButton}
          variant='outlined'
          color='secondary'
          onClick={handleDeleteAlbumClickOpen}
        >
          Delete Album
        </Button>
        <DeleteAlbumDialog
          album={album}
          open={deleteAlbumDialogOpen}
          handleClose={handleDeleteAlbumClickClose}
          deleteAlbum={deleteAlbum}
        ></DeleteAlbumDialog>
      </div>
    </Fragment>
  );
};

export default AdminAlbumView;
