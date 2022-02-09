import React from 'react';

import { useAlertContext } from '../AlertContext';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

const AlertDialog = () => {
  const { isOpen, alertType, msg, closeAlert } = useAlertContext();
  return (
    <Dialog open={isOpen} aria-labelledby='form-dialog-title' maxWidth='lg'>
      <DialogTitle style={{ width: '300px' }} id='form-dialog-title'>
        {alertType}
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>{msg}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAlert} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
