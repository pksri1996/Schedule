import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from '../../api/axios';

const ViewSchedulesDialog = ({ open, onClose }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      fetchSchedules();
    }
  }, [open]);

  const fetchSchedules = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/schedules');
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>View Schedules</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : schedules.length === 0 ? (
          <Typography>No schedules found.</Typography>
        ) : (
          schedules.map(schedule => (
            <Accordion key={schedule._id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {new Date(schedule.startDate).toLocaleDateString()} - {new Date(schedule.endDate).toLocaleDateString()}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {schedule.designationAssignments.map((assignment, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{assignment.designation}</Typography>
                    {assignment.assignment?.zones && Object.entries(assignment.assignment.zones).map(([zoneName, zone]) => (
                      <Box key={zoneName} sx={{ ml: 2, mb: 1 }}>
                        <Typography variant="subtitle2">{zoneName}</Typography>
                        <ul>
                          {(zone?.employees || []).map(emp => (
                            <li key={emp._id}>{emp.name} ({emp.designation})</li>
                          ))}
                        </ul>
                      </Box>
                    ))}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewSchedulesDialog;
