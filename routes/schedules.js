const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const Employee = require('../models/employee');

// 1. Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving schedules', error: err });
  }
});

// 2. Get a specific schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving schedule', error: err });
  }
});

// 3. Create a new schedule



router.post('/', async (req, res) => {
  try {
    // Extract start and end date from request body
    const { startDate, endDate } = req.body;

    // Fetch all employees, sorting by least centralZoneDays first
    const employees = await Employee.find().sort({ centralZoneDays: 1 });

    let assignments = [
      { zone: 'Central', employees: [], replacements: [] },
      { zone: 'East', employees: [], replacements: [] },
      { zone: 'West', employees: [], replacements: [] },
      { zone: 'North', employees: [], replacements: [] },
      { zone: 'South', employees: [], replacements: [] }
    ];

    let reserves = [];
    let employeesOnLeave = [];

    // Assign 300 employees to Central first (those with the least central zone days)
    let centralAssigned = 0;
    for (let emp of employees) {
      if (centralAssigned < 300) {
        assignments.find(a => a.zone === 'Central').employees.push(emp._id);
        emp.centralZoneDays += 10; // Increment central zone days
        centralAssigned++;
      }
    }

    // Assign remaining employees to their preferred zones
    let zoneCounts = { East: 0, West: 0, North: 0, South: 0 };
    for (let emp of employees) {
      if (!assignments.find(a => a.employees.includes(emp._id))) {
        for (let assignment of assignments) {
          if (
            emp.preferredZones.includes(assignment.zone) &&
            assignment.zone !== 'Central' &&
            zoneCounts[assignment.zone] < 300
          ) {
            assignment.employees.push(emp._id);
            zoneCounts[assignment.zone]++;
            break;
          }
        }
      }
    }

    // Add remaining employees to reserves
    reserves = employees
      .filter(emp => !assignments.some(a => a.employees.includes(emp._id)))
      .map(emp => emp._id);

    // Save updated central zone counts
    for (let emp of employees) {
      await emp.save();
    }

    // Create and save the new schedule
    const newSchedule = new Schedule({
      startDate,
      endDate,
      assignments,
      reserves,
      employeesOnLeave
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);

  } catch (err) {
    console.error("Schedule Creation Error:", err);
    res.status(500).json({ message: 'Error creating schedule', error: err });
  }
});




// router.post('/', async (req, res) => {
//   const { startDate, endDate, assignments, reserves, employeesOnLeave } = req.body;
  
//   try {
//     const newSchedule = new Schedule({
//       startDate,
//       endDate,
//       assignments,
//       reserves,
//       employeesOnLeave
//     });
//     await newSchedule.save();
//     res.status(201).json(newSchedule);
//   } catch (err) {
//     res.status(500).json({ message: 'Error creating schedule', error: err });
//   }
// });

// 4. Update a schedule (e.g., handling dynamic leave replacements)
router.put('/:id', async (req, res) => {
  const { assignments, reserves, employeesOnLeave } = req.body;
  
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { assignments, reserves, employeesOnLeave },
      { new: true }
    );
    res.status(200).json(updatedSchedule);
  } catch (err) {
    res.status(500).json({ message: 'Error updating schedule', error: err });
  }
});

// 5. Delete a schedule (if needed)
router.delete('/:id', async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting schedule', error: err });
  }
});

module.exports = router;
