const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const Employee = require('../models/employee');

// GET schedule by date
router.get('/by-date/:date', async (req, res) => {
  try {
    const inputDate = new Date(req.params.date);

    if (isNaN(inputDate)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const schedule = await Schedule.findOne({
      startDate: { $lte: inputDate },
      endDate: { $gte: inputDate }
    }).populate({
      path: 'onLeaveEmployees',
      select: 'name designation status'
    }).populate({
      path: 'designationAssignments.TSI.zones.East.employees designationAssignments.TSI.zones.West.employees designationAssignments.TSI.zones.North.employees designationAssignments.TSI.zones.South.employees designationAssignments.TSI.zones.Central.employees designationAssignments.TSI.reserves',
      select: 'name designation'
    }).populate({
      path: 'designationAssignments.HC.zones.East.employees designationAssignments.HC.zones.West.employees designationAssignments.HC.zones.North.employees designationAssignments.HC.zones.South.employees designationAssignments.HC.zones.Central.employees designationAssignments.HC.reserves',
      select: 'name designation'
    }).populate({
      path: 'designationAssignments.C.zones.East.employees designationAssignments.C.zones.West.employees designationAssignments.C.zones.North.employees designationAssignments.C.zones.South.employees designationAssignments.C.zones.Central.employees designationAssignments.C.reserves',
      select: 'name designation'
    });

    if (!schedule) {
      return res.status(404).json({ message: 'No schedule found for this date.' });
    }

    res.status(200).json(schedule);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Post a new schedule by date.


module.exports = router;
