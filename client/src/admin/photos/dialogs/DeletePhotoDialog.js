import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const DeletePhotoDialog = ({
  deletePhotoDialogisOpen,
  handleDeletePhoto,
  handleDeletePhotoDialogClose,
  photo,
}) => {
  return (
    <div>
      <Dialog
        open={deletePhotoDialogisOpen}
        onClose={handleDeletePhotoDialogClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>{`Deleting Photo: ${photo.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you would like to delete this photo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeletePhotoDialogClose}>Cancel</Button>
          <Button onClick={handleDeletePhoto}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeletePhotoDialog;
