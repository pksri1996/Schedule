const mongoose = require('mongoose');
const Employee = require('./models/employee');
const Schedule = require('./models/schedule');
const DesignationAssignment = require('./models/designation');
const Replacement = require('./models/replacement');
const Zone = require('./models/zone');

mongoose.connect('mongodb://127.0.0.1:27017/schedulingApp')
  .then(() => console.log('✅ Mongoose connected'))
  .catch(err => console.log('❌ Connection error:', err));

const zones = ['East', 'West', 'North', 'South', 'Central'];
const scheduleStartDate = new Date('2025-03-20');
const scheduleEndDate = new Date('2025-03-29');

async function seedData() {
  // Clear all relevant collections
  await Promise.all([
    Employee.deleteMany({}),
    Schedule.deleteMany({}),
    DesignationAssignment.deleteMany({}),
    Replacement.deleteMany({}),
    Zone.deleteMany({})
  ]);

  console.log('🧹 All collections cleared.');

  const totalEmployees = 45;
  const employeeNames = Array.from({ length: totalEmployees }, (_, i) => `Employee ${i + 1}`);
  const designations = ['TSI', 'HC', 'C'];
  const employees = [];

  // Create 15 of each designation
  for (let i = 0; i < totalEmployees; i++) {
    const designation = designations[Math.floor(i / 15)];
    employees.push({
      name: employeeNames[i],
      preferredZones: getRandomZones(),
      centralZoneDays: 0,
      status: 'Active',
      designation,
      Ldate: new Date('1900-04-01'),
      leaveDates: []
    });
  }

  const insertedEmployees = await Employee.insertMany(employees);
  console.log("✅ 45 Employees Seeded!");

  // Create and save an empty schedule for now or logic can be expanded based on need
  // const schedule = new Schedule({
  //   startDate: scheduleStartDate,
  //   endDate: scheduleEndDate,
  //   designationAssignments: [],
  //   onLeaveEmployees: []
  // });

  // await schedule.save();
  // console.log("✅ Empty Schedule Seeded!");

  mongoose.connection.close();
}

function getRandomZones() {
  const base = ['East', 'West', 'North', 'South'];
  return base.sort(() => 0.5 - Math.random()).slice(0, 2);
}

seedData().catch(err => console.error(err));
