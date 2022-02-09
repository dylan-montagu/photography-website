import React, { useCallback, useState, useEffect } from 'react';
import Gallery from 'react-photo-gallery';
import axios from 'axios';

import Photo from './HomePhotoGalleryElement';

export const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);

  const getPhotos = async () => {
    try {
      const res = await axios.get('/api/albums/name/default');
      res.data.photos.forEach((photo) => {
        photo.key = photo.AWSFilename;
        photo.src = photo._id; // src is used as key by <Gallery>, we don't actually use it for displaying photos
      });
      setPhotos(res.data.photos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPhotos();
  }, []);

  const imageRenderer = useCallback(
    ({ index, left, top, key, photo }) => (
      <Photo
        key={key}
        margin={'2px'}
        index={index}
        photo={photo}
        left={left}
        top={top}
      />
    ),
    []
  );

  return (
    <div>
      <Gallery
        photos={photos}
        renderImage={imageRenderer}
        targetRowHeight={500} // default is 300
      />
    </div>
  );
};

export default PhotoGallery;
