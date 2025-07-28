const mongoose = require('mongoose');
const Employee = require('./models/employee');
const Schedule = require('./models/schedule');
const DesignationAssignment = require('./models/designation');
const Replacement = require('./models/replacement');
const Zone = require('./models/zone');

mongoose.connect('mongodb://127.0.0.1:27017/schedulingApp')
  .then(() => console.log('✅ Mongoose connected'))
  .catch(err => console.error('❌ Connection error:', err));

const scheduleStartDate = new Date('2025-03-20');
const scheduleEndDate = new Date('2025-03-29');
const totalEmployees = 3000;
const designations = ['TSI', 'HC', 'C'];

async function seedData() {
  try {
    // Clear all relevant collections
    await Promise.all([
      Employee.deleteMany({}),
      Schedule.deleteMany({}),
      DesignationAssignment.deleteMany({}),
      Replacement.deleteMany({}),
      Zone.deleteMany({})
    ]);

    console.log('🧹 All collections cleared.');

    const employees = [];

    // Assign 1000 employees to each designation (TSI, HC, C)
    for (let i = 0; i < totalEmployees; i++) {
      const designation = designations[Math.floor(i / 1000)];

      employees.push({
        name: `Employee ${i + 1}`,
        designation,
        preferredZones: getRandomZones(),
        centralZoneDays: 0,
        status: 'Active',
        Ldate: new Date('1900-04-01'),
        leaveDates: []
      });
    }

    const insertedEmployees = await Employee.insertMany(employees);
    console.log(`✅ ${insertedEmployees.length} Employees Seeded!`);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    mongoose.connection.close();
  }
}

function getRandomZones() {
  const zones = ['East', 'West', 'North', 'South'];
  return zones.sort(() => 0.5 - Math.random()).slice(0, 2);
}

seedData();
