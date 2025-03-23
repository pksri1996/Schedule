
const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

// 1️⃣ Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving employees', error: err });
  }
});

// 2️⃣ Get a specific employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving employee', error: err });
  }
});

// 3️⃣ Add a new employee
router.post('/create', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Update an employee using req.params
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
   

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// 5️⃣ Delete an employee (if needed)
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ _id: req.params.id });
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee', error: err });
  }
});


//Get all the leaves for the employee

router.get('/:id/leaves', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json({ leaveDates: employee.leaveDates });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaves', error: err });
  }
});



//This is to add leaves for a particular employee.

router.put('/:id/leave/add', async (req, res) => {
  try {
    const { id } = req.params;
    let { leaveDates } = req.body;

    if (!Array.isArray(leaveDates) || leaveDates.length === 0) {
      return res.status(400).json({ message: 'leaveDates must be a non-empty array' });
    }

    // Convert all values to Date objects, and filter out invalid ones
    leaveDates = leaveDates
      .map(date => new Date(date))
      .filter(date => !isNaN(date));

    if (leaveDates.length === 0) {
      return res.status(400).json({ message: 'No valid dates provided' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $addToSet: { leaveDates: { $each: leaveDates } } },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Leave dates added successfully', employee: updatedEmployee });
  } catch (error) {
    console.error("Error adding leave dates:", error);
    res.status(500).json({ message: 'Error adding leave dates', error });
  }
});




//This is to remove leave on a particular date for an employee

router.put('/:id/leave/remove', async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveDates } = req.body;

    if (!leaveDates || !Array.isArray(leaveDates) || leaveDates.length === 0) {
      return res.status(400).json({ message: 'Leave dates are required in an array' });
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { $pull: { leaveDates: { $in: leaveDates } } }, // Removes specific leave dates
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Leave dates removed successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Error removing leave dates', error });
  }
});

module.exports = router;
