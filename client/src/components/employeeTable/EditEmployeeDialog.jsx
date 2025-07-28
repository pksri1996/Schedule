import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from '../../api/axios';

const EditEmployeeDialog = ({ open, onClose, employeeId, onUpdate }) => {
  const [employee, setEmployee] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employeeId && open) {
      setLoading(true);
      axios.get(`/api/employees/${employeeId}`)
        .then(res => {
          setEmployee(res.data);
          setForm({
            name: res.data.name || '',
            preferredZones: res.data.preferredZones || [],
            centralZoneDays: res.data.centralZoneDays || 0,
            status: res.data.status || 'Active',
            designation: res.data.designation || 'C',
          });
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading employee:', err);
          setError('Failed to load employee details');
          setLoading(false);
        });
    }
  }, [employeeId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'preferredZones') {
      const selected = Array.from(e.target.selectedOptions, o => o.value);
      setForm(prev => ({ ...prev, [name]: selected }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`/api/employees/update/${employeeId}`, form);
      onUpdate(res.data);
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      setError('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Employee</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Preferred Zones"
                name="preferredZones"
                select
                SelectProps={{ multiple: true }}
                fullWidth
                value={form.preferredZones}
                onChange={handleChange}
              >
                {['East', 'West', 'North', 'South'].map(zone => (
                  <MenuItem key={zone} value={zone}>
                    {zone}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Designation"
                name="designation"
                select
                fullWidth
                value={form.designation}
                onChange={handleChange}
              >
                {['TSI', 'HC', 'C'].map(des => (
                  <MenuItem key={des} value={des}>
                    {des}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Status"
                name="status"
                select
                fullWidth
                value={form.status}
                onChange={handleChange}
              >
                {['Active', 'On Leave', 'Reserve'].map(stat => (
                  <MenuItem key={stat} value={stat}>
                    {stat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmployeeDialog;
