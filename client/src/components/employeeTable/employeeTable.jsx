// src/components/employeeTable/EmployeeTable.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
  Table, TableHead, TableRow, TableCell,
  TableBody, Collapse, IconButton, Box, Typography,
  Paper, TableContainer, Button
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Edit } from '@mui/icons-material';
import EmployeeDetails from './EmployeeDetails';
import EditEmployeeDialog from './EditEmployeeDialog';
import DeleteButton from './deleteButton'; 
import ViewLeavesDialog from './viewLeavesDialogue'; 

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/api/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleUpdate = (updated) => {
    setEmployees(prev => prev.map(emp => emp._id === updated._id ? updated : emp));
  };

const [viewLeavesEmployeeId, setViewLeavesEmployeeId] = useState(null);
const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);


  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Central Zone Days</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(emp => (
              <React.Fragment key={emp._id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton onClick={() => toggleExpand(emp._id)}>
                      {expandedId === emp._id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell align="center">{emp.centralZoneDays}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color:
                          emp.status === 'Active'
                            ? 'green'
                            : emp.status === 'On Leave'
                            ? 'orange'
                            : 'gray'
                      }}
                    >
                      {emp.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setEditEmployeeId(emp._id)}
                    >
                      <Edit fontSize="small" />
                    </Button>
                  </TableCell>

                  {/* This is the delete button */}
                      <TableCell>
                      <DeleteButton
                      employeeId={emp._id}
                      onDeleteSuccess={(deletedId) =>
                      setEmployees(prev => prev.filter(e => e._id !== deletedId))
                      }
                      />
                      </TableCell>

{/* This row is for button of leaves */}

                        <TableCell>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setViewLeavesEmployeeId(emp._id);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            View Leaves
                          </Button>

                        </TableCell>


                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedId === emp._id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <EmployeeDetails employeeId={emp._id} />
                      </Box>
                    </Collapse>
                  </TableCell>

                  
                </TableRow>
              </React.Fragment>


              



            ))}
          </TableBody>
        </Table>
      </TableContainer>


          <EditEmployeeDialog
          open={Boolean(editEmployeeId)}
          employeeId={editEmployeeId}
          onClose={() => setEditEmployeeId(null)}
          onUpdate={handleUpdate}
          />

<ViewLeavesDialog
  open={isViewDialogOpen}
  onClose={() => {
    setIsViewDialogOpen(false);
    setViewLeavesEmployeeId(null);
  }}
  employeeId={viewLeavesEmployeeId}
/>



          

          

    </>
  );
};

export default EmployeeTable;
