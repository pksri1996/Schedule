const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const Employee = require('../models/employee');
const Zone = require('../models/zone');
const DesignationAssignment = require('../models/designation');

const zones = ['East', 'West', 'North', 'South', 'Central'];

router.post('/', async (req, res) => {
  try {
    const { startDate, endDate, requirements } = req.body; // requirements: { TSI: {East: 10, Central: 20, ...}, HC: {...}, C: {...} }

    const onLeaveEmployees = await Employee.find({ status: 'On Leave' });
    const designationAssignments = [];

    for (const designation of Object.keys(requirements)) {
      const all = await Employee.find({ designation });
      const notOnLeave = all.filter(e => e.status !== 'On Leave');

      // CENTRAL assignment
      let centralNeeded = requirements[designation].Central || 0;
      let availableCentral = notOnLeave.filter(e => e.centralZoneDays === 0);

      if (availableCentral.length < centralNeeded) {
        
        await Employee.updateMany({ designation }, { $set: { centralZoneDays: 0 } });

        const tempList = notOnLeave.map(e => e); 
        const remainingCount = centralNeeded - availableCentral.length;

        const alreadyIncludedIds = new Set(availableCentral.map(e => e._id.toString()));
        const additionalNeeded = tempList.filter(e => !alreadyIncludedIds.has(e._id.toString())).slice(0, remainingCount);

        availableCentral = [...availableCentral, ...additionalNeeded];
      }

      const centralAssignees = availableCentral.slice(0, centralNeeded);
      const centralIds = centralAssignees.map(e => e._id);
      await Employee.updateMany({ _id: { $in: centralIds } }, { $inc: { centralZoneDays: 10 } });

      const zonesAssignments = {};
      const zoneDocs = {};

      // Central Zone
      zoneDocs['Central'] = await Zone.create({ employees: centralIds, replacements: [] });
      zonesAssignments['Central'] = centralIds;

      const remaining = notOnLeave.filter(e => !centralIds.includes(e._id));

      for (const zone of zones) {
        if (zone === 'Central') continue;

        const count = requirements[designation][zone] || 0;
        const preferred = remaining.filter(e => e.preferredZones.includes(zone)).slice(0, count);
        const fallback = remaining.filter(e => !preferred.includes(e)).slice(0, count - preferred.length);
        const assigned = [...preferred, ...fallback];

        zoneDocs[zone] = await Zone.create({ employees: assigned.map(e => e._id), replacements: [] });
        zonesAssignments[zone] = assigned.map(e => e._id);
      }

      const assignedIds = Object.values(zonesAssignments).flat().map(id => id.toString());
      const reserves = notOnLeave.filter(e => !assignedIds.includes(e._id.toString()));

      const assignmentDoc = await DesignationAssignment.create({
        zones: {
          East: zoneDocs['East']._id,
          West: zoneDocs['West']._id,
          North: zoneDocs['North']._id,
          South: zoneDocs['South']._id,
          Central: zoneDocs['Central']._id
        },
        reserves: reserves.map(e => e._id)
      });

      designationAssignments.push({
        designation,
        assignment: assignmentDoc._id
      });
    }

    const schedule = await Schedule.create({
      startDate,
      endDate,
      designationAssignments,
      onLeaveEmployees: onLeaveEmployees.map(e => e._id)
    });

    res.status(201).json(schedule);
  } catch (err) {
    console.error('Schedule creation error:', err);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});


router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate({
        path: 'designationAssignments.assignment',
        populate: [
          {
            path: 'zones.East zones.West zones.North zones.South zones.Central',
            populate: {
              path: 'employees replacements',
              model: 'Employee'
            }
          },
          {
            path: 'reserves',
            model: 'Employee'
          }
        ]
      })
      .populate('onLeaveEmployees');

    res.status(200).json(schedules);
  } catch (err) {
    console.error('Error fetching schedules:', err);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});


module.exports = router;
