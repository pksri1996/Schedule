import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';

const EmployeeDetails = ({ employeeId }) => {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`/api/employees/${employeeId}`);
        setEmployee(res.data);
      } catch (err) {
        console.error('Error fetching employee details:', err);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (!employee) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={2}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <CardContent sx={{ px: 3, py: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Employee Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Name:</strong> {employee.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Designation:</strong> {employee.designation}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Status:</strong> {employee.status}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Central Zone Days:</strong> {employee.centralZoneDays}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Preferred Zones:</strong>{' '}
              {employee.preferredZones.map((zone, i) => (
                <Chip
                  key={i}
                  label={zone}
                  variant="outlined"
                  size="small"
                  color="secondary"
                  sx={{ mr: 1 }}
                />
              ))}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Last Worked in Central Zone:</strong>{' '}
              {new Date(employee.Ldate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Leave Dates:</strong>{' '}
              {employee.leaveDates.length > 0
                ? employee.leaveDates
                    .map(date => new Date(date).toLocaleDateString())
                    .join(', ')
                : 'None'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EmployeeDetails;
