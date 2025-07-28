// src/components/leaves/ViewLeavesDialog.jsx
import React, { useEffect, useState } from 'react';
import AddLeaveDialog from './AddLeaveDialog';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../../api/axios';





const ViewLeavesDialog = ({ open, onClose, employeeId }) => {
  const [leaveDates, setLeaveDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (open && employeeId) {
      setLoading(true);
      axios.get(`/api/employees/${employeeId}`)
        .then(res => {
          setLeaveDates(res.data.leaveDates);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load leave data');
          setLoading(false);
        });
    }
  }, [employeeId, open]);

  const refreshLeaveList = async () => {
  try {
    const res = await axios.get(`/api/employees/${employeeId}`);
    setLeaveDates(res.data.leaveDates);
  } catch (err) {
    setError('Failed to reload leave data');
  }
};

  const handleDelete = async (dateToDelete) => {
  try {
    await axios.put(`/api/employees/update/${employeeId}`, {
      leaveDates: leaveDates.filter(d => d !== dateToDelete),
    });
    refreshLeaveList();
  } catch (err) {
    setError('Failed to delete leave date');
  }
};
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Leave Dates</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {error && <Alert severity="error">{error}</Alert>}
            {leaveDates.length === 0 ? (
              <Typography>No leave dates found.</Typography>
            ) : (
              <List>
                {leaveDates.map(date => (
                  <ListItem key={date} divider>
                    <ListItemText
                      primary={new Date(date).toLocaleDateString()}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDelete(date)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAddOpen(true)}>Add Leave</Button>
        <Button onClick={onClose} color="inherit">Close</Button>
      </DialogActions>

      <AddLeaveDialog
  open={addOpen}
  onClose={() => setAddOpen(false)}
  employeeId={employeeId}
  onLeaveAdded={refreshLeaveList}
/>
    </Dialog>
  );
};

export default ViewLeavesDialog;
