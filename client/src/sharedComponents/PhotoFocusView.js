import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useProgressiveImg from '../util/useProgressiveImg';
import NavigationIcons from '../sharedComponents/NavigationIcons';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  photoDescription: {
    fontSize: '1.6rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.05rem',
    },
    '@media (max-width:420px)': {
      fontSize: '0.85rem',
    },
    bottom: '0%',
    padding: '10px',
  },
}));

const PhotoFocusView = ({
  match,
  photo,
  index,
  previousLink,
  nextLink,
  enterLink,
}) => {
  const [offsetHeight, setOffsetHeight] = useState(0);
  const [src, { blur }] = useProgressiveImg(
    photo.urlSmall,
    photo.urlLarge ? photo.urlLarge : photo.urlMedium
  );

  console.log(photo.urlLarge);

  useEffect(() => {
    // get heights
    setOffsetHeight(
      document.getElementById('header').offsetHeight +
        document.getElementById('photo-description').offsetHeight +
        document.getElementById('navigation-buttons').offsetHeight
    );
  }, []);

  const classes = useStyles();
  return (
    <div>
      <div>
        <Link to={enterLink}>
          <div>
            <img
              style={{
                width: '100%',
                maxHeight: window.innerHeight * 0.95 - offsetHeight,
                objectFit: 'contain',
                filter: blur ? 'blur(20px)' : 'none',
                transition: blur ? 'none' : 'filter 0.3s ease-out',
                paddingTop: 10,
              }}
              alt='temp'
              src={src}
            ></img>
          </div>
        </Link>
      </div>
      <Typography
        id='photo-description'
        className={classes.photoDescription}
        align='center'
        variant='body2'
      >
        {/* {photo.description} */}
      </Typography>
      <NavigationIcons
        match={match}
        index={index}
        photo={photo}
        previousLink={previousLink}
        nextLink={nextLink}
      ></NavigationIcons>
    </div>
  );
};

export default PhotoFocusView;
