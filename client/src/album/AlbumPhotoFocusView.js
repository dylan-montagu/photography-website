import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import PhotoFocusView from '../sharedComponents/PhotoFocusView';

const AlbumPhotoFocusView = ({ props, match }) => {
  const history = useHistory();

  const [photo, setPhoto] = useState({});
  const [index, setIndex] = useState(0);

  const previousLink = `/album/${match.params.id}/${(
    parseInt(match.params.index) - 1
  ).toString()}`;
  const nextLink = `/album/${match.params.id}/${(
    parseInt(match.params.index) + 1
  ).toString()}`;
  const enterLink = `/album/${match.params.id}`;

  const getPhoto = async (albumId, index) => {
    const res = await axios.get('/api/albums/' + albumId + '/index/' + index);
    setPhoto(res.data);
  };

  const checkKey = (e) => {
    e = e || window.event;
    if (e.key === 'ArrowLeft' && index > 0) {
      history.push(previousLink);
    } else if (e.key === 'ArrowRight' && index < photo.nPhotos - 1) {
      history.push(nextLink);
    } else if (e.key === 'Enter') {
      history.push(enterLink);
    }
  };

  document.onkeydown = checkKey;
  useEffect(
    () => () => {
      document.onkeydown = null;
    },
    []
  );

  useEffect(() => {
    const albumId = match.params.id;
    setIndex(match.params.index);

    const tempIndex = match.params.index;
    getPhoto(albumId, tempIndex);
  }, [match.params.index, match.params.id]);

  return (
    <div>
      <PhotoFocusView
        match={match}
        photo={photo}
        index={index}
        previousLink={previousLink}
        nextLink={nextLink}
        enterLink={enterLink}
      ></PhotoFocusView>
    </div>
  );
};

export default AlbumPhotoFocusView;
