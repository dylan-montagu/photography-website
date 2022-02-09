import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { useAuthContext } from './AuthContext';

import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    paddingBottom: 5,
  },
  title: {
    fontSize: '1.8rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.25rem',
    },
    '@media (max-width:420px)': {
      fontSize: '1.05rem',
    },
    textDecoration: 'none',
    color: theme.palette.text.primary,
    fontWeight: 300,
  },
  headerSize: {
    minHeight: 64,
    paddingLeft: 0,
    paddingRight: 0,
  },
  sectionDesktop: {
    paddingLeft: '20px',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    fontWeight: 300,
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    color: theme.palette.text.primary,
  },
}));

const Header = () => {
  const classes = useStyles();
  const authContext = useAuthContext();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMobileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    authContext.logout();
  };

  const renderMenu = (
    <Fragment>
      <Typography
        className={classes.sectionDesktop}
        variant='h6'
        component={Link}
        to={'/'}
      >
        HOME
      </Typography>
      <Typography
        className={classes.sectionDesktop}
        variant='h6'
        component={Link}
        to={'/portfolio'}
      >
        PORTFOLIO
      </Typography>
      <Typography
        className={classes.sectionDesktop}
        variant='h6'
        component={Link}
        to={'/about'}
      >
        ABOUT
      </Typography>
      {authContext.isAuthenticated ? (
        <Typography
          className={classes.sectionDesktop}
          variant='h6'
          component={Link}
          to={'/'}
          onClick={logout}
        >
          LOGOUT
        </Typography>
      ) : undefined}
    </Fragment>
  );

  const renderMobileMenu = (
    <Fragment>
      <div>
        <IconButton
          edge='start'
          className={classes.sectionMobile}
          aria-label='open drawer'
          onClick={handleMobileMenuClick}
        >
          <MoreIcon />
        </IconButton>
      </div>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMobileMenuClose}
      >
        <MenuItem onClick={handleMobileMenuClose} component={Link} to={'/'}>
          HOME
        </MenuItem>
        <MenuItem
          onClick={handleMobileMenuClose}
          component={Link}
          to={'/portfolio'}
        >
          PORTFOLIO
        </MenuItem>
        <MenuItem
          onClick={handleMobileMenuClose}
          component={Link}
          to={'/about'}
        >
          ABOUT
        </MenuItem>
        {authContext.isAuthenticated ? (
          <MenuItem onClick={logout} component={Link} to={'/login'}>
            LOGOUT
          </MenuItem>
        ) : undefined}
      </Menu>
    </Fragment>
  );

  return (
    <div className={classes.grow} id='header'>
      <Toolbar className={classes.headerSize}>
        <Typography
          className={classes.title}
          variant='h5'
          component={Link}
          to={'/'}
        >
          DYLAN MONTAGU PHOTOGRAPHY
        </Typography>
        <Link to='/'></Link>
        <div className={classes.grow} />
        {renderMenu}
        {renderMobileMenu}
      </Toolbar>
    </div>
  );
};

export default Header;
