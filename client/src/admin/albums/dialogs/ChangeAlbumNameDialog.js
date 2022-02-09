import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const ChangeAlbumNameDialog = ({
  album,
  setUpdatedAlbumName,
  handleUpdateAlbumName,
  changeAlbumNameOpen,
  handleChangeAlbumNameClickClose,
}) => {
  return (
    <div>
      <Dialog
        open={changeAlbumNameOpen}
        onClose={handleChangeAlbumNameClickClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>{`Change album name: ${album.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the new name you'd like to call this album.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Album Name'
            fullWidth
            onChange={(e) => setUpdatedAlbumName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangeAlbumNameClickClose}>Cancel</Button>
          <Button onClick={handleUpdateAlbumName}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChangeAlbumNameDialog;
