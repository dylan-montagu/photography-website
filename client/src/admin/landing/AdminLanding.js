import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

import PhotoGalleryResponsiveImage from '../../sharedComponents/PhotoGalleryResponsiveImage';
import PhotoGallery from '../../sharedComponents/PhotoGallery';
import AdminLandingAlbumGalleryElement from './AdminLandingAlbumGalleryElement';
import AdminLandingAllAlbumsPhotoGallery from './AdminLandingAllAlbumsPhotoGallery';
import { useAlertContext } from '../../AlertContext';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CreateNewAlbumDialog from './dialogs/CreateNewAlbumDialog';

const useStyles = makeStyles((theme) => ({
  sectionTitles: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.25rem',
    },
    fontWeight: 300,
    paddingTop: 20,
  },
  editButton: {
    marginRight: 10,
    marginBottom: 10,
  },
}));

export const Admin = () => {
  const classes = useStyles();
  const alertContext = useAlertContext();
  const [albums, setAlbums] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]);
  const [defaultAlbum, setDefaultAlbum] = useState({
    thumbnailPhoto: { _id: '' },
  });
  const [photos, setPhotos] = useState([]);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [createAlbumDialogOpen, setCreateAlbumDialogOpen] = useState(false);
  const [libraryId, setLibraryId] = useState();
  const authContext = useAlertContext();

  if (!authContext.isAuthenticated) {
    <Redirect to='/landing'></Redirect>;
  }

  const openCreateAlbumDialog = () => {
    setCreateAlbumDialogOpen(true);
  };

  const closeCreateAlbumDialog = () => {
    setCreateAlbumDialogOpen(false);
  };

  const createNewAlbum = async () => {
    try {
      await axios.post('/api/albums/', {
        name: newAlbumName,
      });
    } catch (err) {
      console.error(err);
      alertContext.openAlert('Error creating new album', err.response.data.msg);
    }
    getAlbums();
    closeCreateAlbumDialog();
  };

  const getDefaultAlbum = async () => {
    try {
      const res = await axios.get('/api/albums/name/default');
      res.data.thumbnailPhoto._id = res.data._id;
      res.data.thumbnailPhoto.name = 'default';
      setDefaultAlbum(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLibraryId = async () => {
    const res = await axios.get('/api/library/name/default');
    setLibraryId(res.data._id);
  };

  const handleConfirmAlbumArrangement = async () => {
    const albumIds = albums.map((album) => {
      return album._id;
    });
    try {
      await axios.patch(`/api/library/${libraryId}`, {
        albums: albumIds,
      });
    } catch (err) {
      alertContext.openAlert(
        'Error updating album arrangement',
        err.response.data.msg
      );
      console.error(err);
    }
  };

  const getAlbums = async () => {
    try {
      const resAlbums = await axios.get('/api/library/name/default');
      const albums = resAlbums.data.albums.map((album) => {
        album.src = album._id; // <Gallery> uses it as key
        // Gallery needs height and width at first level of object, might as well move everything
        try {
          album.height = album.thumbnailPhoto.height;
          album.width = album.thumbnailPhoto.width;
          album.urlSmall = album.thumbnailPhoto.urlSmall;
          album.urlMedium = album.thumbnailPhoto.urlMedium;
        } catch (error) {
          album.height = 300;
          album.width = 400;
          album.urlSmall = '';
          album.urlMedium = '';
        }
        return album;
      });
      setAlbums(albums);

      const resAllAlbums = await axios.get('/api/albums');
      const allAlbumsNew = resAllAlbums.data
        .filter((album) => album.name !== 'default')
        .filter(
          (album) =>
            !resAlbums.data.albums.filter((e) => e._id === album._id).length > 0
        )
        .map((album) => {
          album.src = album._id; // <Gallery> uses it as key
          // Gallery needs height and width at first level of object, might as well move everything
          try {
            album.height = album.thumbnailPhoto.height;
            album.width = album.thumbnailPhoto.width;
            album.urlSmall = album.thumbnailPhoto.urlSmall;
            album.urlMedium = album.thumbnailPhoto.urlMedium;
          } catch (error) {
            album.height = 300;
            album.width = 400;
            album.urlSmall = '';
            album.urlMedium = '';
          }
          return album;
        });
      setAllAlbums(allAlbumsNew);
    } catch (error) {
      console.error(error);
    }
  };

  const getPhotos = async () => {
    try {
      const res = await axios.get('/api/photos?limit=30');
      res.data.forEach((photo) => {
        photo.key = photo._id;
        photo.src = photo._id; // used as key by <Gallery>
      });
      setPhotos(res.data);
    } catch (err) {
      console.error(err.response);
    }
  };

  useEffect(() => {
    getAlbums();
    getPhotos();
    getDefaultAlbum();
    getLibraryId();
  }, []);

  return (
    <Fragment>
      <Typography align='center' variant='h5' className={classes.sectionTitles}>
        ADMIN CONSOLE
      </Typography>
      <Typography variant='h6' className={classes.sectionTitles}>
        EDIT ALL PHOTOS
      </Typography>
      <Link to={`/admin/photos`}>
        <PhotoGallery
          photos={photos}
          GalleryElement={PhotoGalleryResponsiveImage}
          margin='1px'
          targetRowHeight={40}
          thumbnail={true}
        />
      </Link>
      <Typography variant='h6' className={classes.sectionTitles}>
        EDIT DEFAULT ALBUM
      </Typography>
      <AdminLandingAlbumGalleryElement album={defaultAlbum.thumbnailPhoto} />
      <Typography variant='h6' className={classes.sectionTitles}>
        EDIT AND REORDER ALBUMS IN LIBRARY
      </Typography>
      <div>
        <Button
          className={classes.editButton}
          variant='outlined'
          onClick={openCreateAlbumDialog}
        >
          Create new album
        </Button>
        <Button
          className={classes.editButton}
          variant='outlined'
          onClick={handleConfirmAlbumArrangement}
        >
          Confirm album arrangement
        </Button>
        <CreateNewAlbumDialog
          createAlbumDialogOpen={createAlbumDialogOpen}
          closeCreateAlbumDialog={closeCreateAlbumDialog}
          setNewAlbumName={setNewAlbumName}
          createNewAlbum={createNewAlbum}
        />
      </div>
      <AdminLandingAllAlbumsPhotoGallery
        albums={albums}
        setAlbums={setAlbums}
      ></AdminLandingAllAlbumsPhotoGallery>
      <Typography variant='h6' className={classes.sectionTitles}>
        EDIT ALBUMS NOT IN LIBRARY
      </Typography>
      <PhotoGallery
        photos={allAlbums}
        GalleryElement={AdminLandingAlbumGalleryElement}
        margin='2px'
        targetRowHeight={200}
      />
    </Fragment>
  );
};

export default Admin;
