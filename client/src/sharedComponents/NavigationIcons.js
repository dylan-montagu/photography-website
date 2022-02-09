import React from 'react';

import { Link } from 'react-router-dom';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import IconButton from '@material-ui/core/IconButton';

const NavigationIcons = ({ match, index, photo, previousLink, nextLink }) => {
  return (
    <div align='center' id='navigation-buttons' className='navigation'>
      <Link
        to={previousLink}
        style={match.params.index <= 0 ? { pointerEvents: 'none' } : {}}
      >
        {index <= 0 ? (
          <IconButton disabled>
            <NavigateBeforeIcon />
          </IconButton>
        ) : (
          <IconButton>
            <NavigateBeforeIcon />
          </IconButton>
        )}
      </Link>
      <Link
        to={nextLink}
        style={
          match.params.index >= photo.nPhotos - 1
            ? { pointerEvents: 'none' }
            : {}
        }
      >
        {index >= photo.nPhotos - 1 ? (
          <IconButton disabled>
            <NavigateNextIcon />
          </IconButton>
        ) : (
          <IconButton>
            <NavigateNextIcon />
          </IconButton>
        )}
      </Link>
    </div>
  );
};

export default NavigationIcons;
