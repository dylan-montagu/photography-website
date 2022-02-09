import React, { useEffect, Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import HomePhotoGallery from './home/HomePhotoGallery';
import Header from './Header';
import AllAlbumsGallery from './album/AllAlbumsGallery';
import AlbumPhotosGallery from './album/AlbumPhotosGallery';
import AlbumPhotoFocusView from './album/AlbumPhotoFocusView';
import HomePhotoFocusView from './home/HomePhotoFocusView';
import About from './About';
import AdminLanding from './admin/landing/AdminLanding';
import AdminAlbumEditPage from './admin/albums/AdminAlbumEditPage';
import AdminPhotosEditPage from './admin/photos/AdminPhotosEditPage';
import AdminPhotoGalleryPhotoEditFocusView from './admin/photos/AdminPhotoGalleryPhotoEditFocusView';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './App.css';
import AuthContextProvider from './AuthContext';
import AlertContextProvider from './AlertContext';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import AlertDialog from './sharedComponents/AlertDialog';

const App = () => {
  // turn off console logs for production
  if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev') {
    console.log = function () {};
    console.error = function () {};
  }

  const theme = createMuiTheme({});

  useEffect(() => {
    document.title = 'Dylan Montagu Photography';
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <link
        rel='stylesheet'
        href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700&display=swap'
      />
      <Router>
        <AuthContextProvider>
          <AlertContextProvider>
            <AlertDialog></AlertDialog>
            <Fragment>
              <Header />
              <Switch>
                <Route exact path='/' component={HomePhotoGallery} />
                <Route exact path='/login' component={Login} />
                <Route
                  exact
                  path='/index/:index'
                  component={HomePhotoFocusView}
                />
                <Route exact path='/portfolio' component={AllAlbumsGallery} />
                <Route exact path='/album/:id' component={AlbumPhotosGallery} />
                <Route
                  exact
                  path='/album/:id/:index'
                  component={AlbumPhotoFocusView}
                />
                <Route exact path='/about' component={About} />
                <PrivateRoute exact path='/admin' component={AdminLanding} />
                <PrivateRoute
                  exact
                  path='/admin/photos'
                  component={AdminPhotosEditPage}
                />
                <PrivateRoute
                  exact
                  path='/admin/photos/:id'
                  component={AdminPhotoGalleryPhotoEditFocusView}
                />
                <PrivateRoute
                  exact
                  path='/admin/album/:id'
                  component={AdminAlbumEditPage}
                />
                <Route render={() => <Redirect to={{ pathname: '/' }} />} />
              </Switch>
            </Fragment>
          </AlertContextProvider>
        </AuthContextProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;

// examples of client side uploads
// https://medium.com/@diego.f.rodriguezh/direct-image-upload-to-aws-s3-with-react-and-express-2f063bc15430
// Code sandbox with selectable images: https://codesandbox.io/s/o7o241q09
