import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  sectionTitles: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.00rem',
    },
    fontWeight: 300,
  },
  bodyText: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.95rem',
    },
  },
  imgContainer: {
    width: '70%',
    paddingBottom: '35%',
    position: 'relative',
    minWidth: '10%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10px',
    marginBottom: '20px',
  },
  imgContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
}));

const About = () => {
  const classes = useStyles();

  return (
    <div>
      <Typography className={classes.sectionTitles} align='center' variant='h5'>
        ABOUT ME
      </Typography>
      <div className={classes.imgContainer}>
        <img
          className={classes.imgContent}
          src='http://d1k5un5jfu3q7.cloudfront.net/static/about_me.jpg'
          alt=''
        ></img>
      </div>

      <Typography className={classes.bodyText} variant='body1'>
        I currently live in the town of Middlebury, Vermont where I work
        remotely as a Software Engineer. In my free time, I like to take full
        advantage of the beautiful nature in the area and often find myself in
        the Green Mountains, Lack Champlain, and Adirondack Mountains.
      </Typography>
    </div>
  );
};

export default About;
