// src/components/DeleteButton.jsx
import React, { useState } from 'react';
import {
  IconButton, Dialog, DialogTitle, DialogActions,
  Button, Tooltip, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../../api/axios';

const DeleteButton = ({ employeeId, onDeleteSuccess }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/employees/${employeeId}`);
      onDeleteSuccess(employeeId); // Tell parent to remove from list
      setOpen(false);
    } catch (err) {
      console.error('❌ Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Tooltip title="Delete">
        <IconButton color="error" onClick={() => setOpen(true)} disabled={deleting}>
          {deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Are you sure you want to delete this employee?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButton;
