import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PhotoGallery from '../sharedComponents/PhotoGallery';
import AlbumPhotosGalleryElement from './AlbumPhotosGalleryElement';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  albumTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.00rem',
    },
    fontWeight: 300,
    paddingBottom: 10,
  },
}));

export const AlbumPhotosGallery = ({ match }) => {
  const classes = useStyles();

  const [photos, setPhotos] = useState([]);
  const [album, setAlbum] = useState({});
  const [loaded, setLoaded] = useState(false);

  const getPhotos = async (albumId) => {
    const res = await axios.get('/api/albums/' + albumId);
    const nPhotos = res.data.photos.length;
    res.data.photos.forEach((photo, index) => {
      photo.key = photo.AWSFilename;
      photo.parentAlbumId = albumId;
      photo.indexInAlbum = index;
      photo.albumLength = nPhotos;
      photo.src = photo._id; // photo.src isn't used for img src, <Gallery> uses it as key
    });
    setPhotos(res.data.photos);
    setAlbum(res.data);
    setLoaded(true);
  };

  useEffect(() => {
    const albumId = match.params.id;
    getPhotos(albumId);
  }, [match.params.id]);

  return (
    <div>
      <Typography className={classes.albumTitle} align='center' variant='h5'>
        {loaded ? album.name.toUpperCase() : ''}
      </Typography>
      <PhotoGallery
        photos={photos}
        GalleryElement={AlbumPhotosGalleryElement}
        margin={'2px'}
        targetRowHeight={500}
      />
    </div>
  );
};

export default AlbumPhotosGallery;
