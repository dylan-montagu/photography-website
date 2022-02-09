import React, { useState, useEffect } from 'react';
import axios from 'axios';

import PhotoGallery from '../sharedComponents/PhotoGallery';
import Album from './AllAlbumsGalleryElement';

export const AlbumGallery = () => {
  const [defaultAlbums, setDefaultAlbums] = useState([]);

  const getAlbums = async () => {
    try {
      const res = await axios.get('/api/library/name/default');
      const albums = res.data.albums.map((album) => {
        album.key = album._id;
        album.src = album._id; // album.src isn't used for img src, <Gallery> uses it as key
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
      setDefaultAlbums(albums);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAlbums();
  }, []);

  return (
    <div>
      <PhotoGallery
        photos={defaultAlbums}
        GalleryElement={Album}
        margin='2px'
        targetRowHeight={500}
      />
    </div>
  );
};

export default AlbumGallery;
