const mongoose = require('mongoose');
const Employee = require('./models/employee');
const Schedule = require('./models/schedule');

mongoose.connect('mongodb://127.0.0.1:27017/schedulingApp')
  .then(() => console.log('✅ Mongoose connected'))
  .catch(err => console.log('❌ Connection error:', err));

const zones = ['East', 'West', 'North', 'South', 'Central'];
const totalEmployees = 3000;
const scheduleStartDate = new Date('2025-03-20');
const scheduleEndDate = new Date('2025-03-29');

async function seedEmployeesAndSchedule() {
  await Employee.deleteMany({});
  await Schedule.deleteMany({});

  const employeeNames = Array.from({ length: totalEmployees }, (_, i) => `Employee ${i + 1}`);

  const designations = ['TSI', 'HC', 'C'];
  const employees = [];
  const designationCounts = { TSI: 0, HC: 0, C: 0 };

  // Ensure at least 500 of each designation
  while (employees.length < totalEmployees) {
    const name = employeeNames[employees.length];
    let designation;
    if (designationCounts.TSI < 500) designation = 'TSI';
    else if (designationCounts.HC < 500) designation = 'HC';
    else if (designationCounts.C < 500) designation = 'C';
    else designation = designations[Math.floor(Math.random() * 3)];

    designationCounts[designation]++;

    employees.push({
      name,
      preferredZones: getRandomZones(),
      centralZoneDays: 0,
      status: 'Active',
      designation,
      Ldate: new Date('1900-04-01'),
      leaveDates: []
    });
  }

  const insertedEmployees = await Employee.insertMany(employees);
  console.log("✅ 3,000 Employees Seeded!");

  // Set 10 employees as on leave
  const leaveEmployees = insertedEmployees.slice(0, 10);
  for (const emp of leaveEmployees) {
    emp.status = 'On Leave';
    await emp.save();
  }

  const activeEmployees = insertedEmployees.filter(e => e.status === 'Active');

  const getZoneAssignments = (employeesList, countPerZone) => {
    const result = {};
    let index = 0;
    zones.forEach(zone => {
      result[zone] = {
        employees: employeesList.slice(index, index + countPerZone).map(e => e._id),
        replacements: []
      };
      index += countPerZone;
    });
    return result;
  };

  const assignDesignation = (designation, totalCountPerZone) => {
    const totalNeeded = totalCountPerZone * zones.length;
    const group = activeEmployees.filter(e => e.designation === designation).slice(0, totalNeeded);
    const assignedIds = group.map(e => e._id.toString());
    const reserves = activeEmployees.filter(e => e.designation === designation && !assignedIds.includes(e._id.toString()));
    return {
      zones: getZoneAssignments(group, totalCountPerZone),
      reserves: reserves.map(e => e._id)
    };
  };

  const schedule = new Schedule({
    startDate: scheduleStartDate,
    endDate: scheduleEndDate,
    designationAssignments: {
      TSI: assignDesignation('TSI', 20),
      HC: assignDesignation('HC', 50),
      C: assignDesignation('C', 100)
    },
    onLeaveEmployees: leaveEmployees.map(e => e._id)
  });

  await schedule.save();
  console.log("✅ Schedule Seeded!");

  mongoose.connection.close();
}

function getRandomZones() {
  const base = ['East', 'West', 'North', 'South'];
  return base.sort(() => 0.5 - Math.random()).slice(0, 2);
}

seedEmployeesAndSchedule().catch(err => console.error(err));
