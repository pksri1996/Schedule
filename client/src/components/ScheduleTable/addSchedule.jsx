import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from '../../api/axios';

const roles = ['TSI', 'HC', 'C'];
const zones = ['East', 'West', 'North', 'South', 'Central'];

const ScheduleDialog = ({ open, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [requirements, setRequirements] = useState({
    TSI: { East: '', West: '', North: '', South: '', Central: '' },
    HC: { East: '', West: '', North: '', South: '', Central: '' },
    C: { East: '', West: '', North: '', South: '', Central: '' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (role, zone, value) => {
    setRequirements(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [zone]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const reqBody = {
        startDate,
        endDate,
        requirements: {}
      };

      roles.forEach(role => {
        reqBody.requirements[role] = {};
        zones.forEach(zone => {
          reqBody.requirements[role][zone] = parseInt(requirements[role][zone], 10) || 0;
        });
      });

      await axios.post('/api/schedules/', reqBody);
      setSuccess('Schedule created successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create New Schedule</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ my: 1 }}>
          <Grid item xs={6}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </Grid>

          {roles.map(role => (
            <Grid item xs={12} key={role}>
              <Box sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>{role} Requirements</Box>
              <Grid container spacing={2}>
                {zones.map(zone => (
                  <Grid item xs={6} sm={4} md={2.4} key={`${role}-${zone}`}>
                    <TextField
                      label={`${zone}`}
                      type="number"
                      fullWidth
                      value={requirements[role][zone]}
                      onChange={e => handleChange(role, zone, e.target.value)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          {success && (
            <Grid item xs={12}>
              <Alert severity="success">{success}</Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDialog;
