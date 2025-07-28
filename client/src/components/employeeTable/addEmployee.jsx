import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
  Chip
} from '@mui/material';
import axios from '../../api/axios';

const AddEmployeeForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: 'C',
    preferredZones: [],
    status: 'Active',
    leaveDates: [] // Optional for now
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const designations = ['TSI', 'HC', 'C'];
  const statuses = ['Active', 'On Leave', 'Reserve'];
  const zones = ['East', 'West', 'North', 'South'];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleZoneChange = (event) => {
    const value = event.target.value;
    if (value.length <= 2) {
      setFormData(prev => ({
        ...prev,
        preferredZones: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.preferredZones.length !== 2) {
      setErrors({ preferredZones: 'Please select exactly 2 preferred zones.' });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await axios.post('/api/employees/create', formData);
      setFormData({
        name: '',
        designation: 'C',
        preferredZones: [],
        status: 'Active',
        leaveDates: []
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error adding employee:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add New Employee
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Designation</InputLabel>
                <Select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  label="Designation"
                >
                  {designations.map(des => (
                    <MenuItem key={des} value={des}>
                      {des}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.preferredZones}>
                <InputLabel>Preferred Zones</InputLabel>
                <Select
                  name="preferredZones"
                  multiple
                  value={formData.preferredZones}
                  onChange={handleZoneChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {zones.map(zone => (
                    <MenuItem key={zone} value={zone}>
                      {zone}
                    </MenuItem>
                  ))}
                </Select>
                {errors.preferredZones && (
                  <FormHelperText>{errors.preferredZones}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                fullWidth
              >
                {submitting ? 'Submitting...' : 'Add Employee'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddEmployeeForm;
