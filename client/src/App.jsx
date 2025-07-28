import { useState, lazy, Suspense } from 'react';
import './App.css';
import EmployeeTable from './components/employeeTable/employeeTable';
import AddEmployeeForm from './components/employeeTable/addEmployee';
import { Button, Box, CircularProgress } from '@mui/material';

// ✅ Lazy load dialogs
const AddScheduleDialog = lazy(() => import('./components/ScheduleTable/addSchedule'));
const ViewSchedulesDialog = lazy(() => import('./components/ScheduleTable/viewSchedule'));

function App() {
  const [openAddSchedule, setOpenAddSchedule] = useState(false);
  const [openViewSchedules, setOpenViewSchedules] = useState(false);

  return (
    <>
      <Box display="flex" gap={2} p={2}>
        <Button variant="contained" onClick={() => setOpenAddSchedule(true)}>
          Add Schedule
        </Button>
        <Button variant="outlined" onClick={() => setOpenViewSchedules(true)}>
          View Schedules
        </Button>
      </Box>

      {/* ✅ Lazy-loaded dialogs inside Suspense */}
      <Suspense fallback={<CircularProgress />}>
        {openAddSchedule && (
          <AddScheduleDialog open={openAddSchedule} onClose={() => setOpenAddSchedule(false)} />
        )}
        {openViewSchedules && (
          <ViewSchedulesDialog open={openViewSchedules} onClose={() => setOpenViewSchedules(false)} />
        )}
      </Suspense>

      <AddEmployeeForm />
      <p style={{ marginBottom: '3rem' }}></p>
      <EmployeeTable />
    </>
  );
}

export default App;
