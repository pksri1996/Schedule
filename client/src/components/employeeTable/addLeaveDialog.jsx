// src/components/leaves/AddLeaveDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import axios from '../../api/axios';

const AddLeaveDialog = ({ open, onClose, employeeId, onLeaveAdded }) => {
  const [leaveDate, setLeaveDate] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!leaveDate) return setError('Please select a date.');

    setSaving(true);
    setError('');

    try {
      // Fetch existing leaves first
      const res = await axios.get(`/api/employees/${employeeId}`);
      const updatedLeaves = [...res.data.leaveDates, leaveDate];

      // Update employee
      await axios.put(`/api/employees/update/${employeeId}`, {
        leaveDates: updatedLeaves,
      });

      onLeaveAdded(); // optional: refetch or update UI
      onClose();
    } catch (err) {
      setError('Failed to add leave date');
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (e) => {
    setLeaveDate(e.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add Leave Date</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          label="Leave Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={leaveDate}
          onChange={handleDateChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleAdd} variant="contained" disabled={saving}>
          {saving ? 'Saving...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLeaveDialog;
