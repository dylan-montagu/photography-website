import React, { useState, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import setAuthToken from './util/setAuthToken';
import { useAuthContext } from './AuthContext';
import { useAlertContext } from './AlertContext';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const useStyles = makeStyles((theme) => ({
  loginInput: {
    width: '100%',
    paddingBottom: 20,
  },
  sectionTitles: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.00rem',
    },
    fontWeight: 300,
    paddingBottom: 30,
  },
  parentDiv: {
    width: 300,
    position: 'fixed',
    top: '45%',
    left: '50%',
    webkitTtransform: 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)',
  },
}));
const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const authContext = useAuthContext();
  const alertContext = useAlertContext();

  const loginUser = async () => {
    try {
      const res = await axios.post('/api/auth', {
        email: email,
        password: password,
      });
      setAuthToken(res.data.token);
      authContext.login();
    } catch (err) {
      alertContext.openAlert(
        'Error logging in',
        err.response.data.errors[0].msg
      );
      authContext.logout();
    }
  };

  if (authContext.isAuthenticated) {
    return <Redirect to='/admin' />;
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Fragment>
      {authContext.isLoading ? (
        <div></div>
      ) : (
        <div className={classes.parentDiv}>
          <Typography className={classes.sectionTitles} variant='h5'>
            LOGIN
          </Typography>
          <div>
            <FormControl className={classes.loginInput} variant='outlined'>
              <InputLabel htmlFor='outlined-adornment-password'>
                Email
              </InputLabel>
              <OutlinedInput
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                labelWidth={40}
              />
            </FormControl>
          </div>
          <div>
            <FormControl className={classes.loginInput} variant='outlined'>
              <InputLabel htmlFor='outlined-adornment-password'>
                Password
              </InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
          </div>

          <Button variant='outlined' onClick={loginUser}>
            LOGIN
          </Button>
        </div>
      )}
    </Fragment>
  );
};

export default Login;
