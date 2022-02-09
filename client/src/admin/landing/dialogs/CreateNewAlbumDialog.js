import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const CreateNewAlbumDialog = ({
  createAlbumDialogOpen,
  closeCreateAlbumDialog,
  setNewAlbumName,
  createNewAlbum,
}) => {
  return (
    <Dialog
      open={createAlbumDialogOpen}
      onClose={closeCreateAlbumDialog}
      aria-labelledby='form-dialog-title'
      maxWidth='lg'
    >
      <DialogTitle style={{ width: '300px' }} id='form-dialog-title'>
        Create a new Album
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Album Name: </DialogContentText>
        <TextField
          onChange={(e) => setNewAlbumName(e.target.value)}
          autoFocus
          margin='dense'
          id='name'
          label=''
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeCreateAlbumDialog} color='primary'>
          Cancel
        </Button>
        <Button onClick={createNewAlbum} color='primary'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewAlbumDialog;
