const mongoose = require('mongoose');
const Employee = require('./models/employee');

mongoose.connect('mongodb://127.0.0.1:27017/schedulingApp')
    .then(() => console.log('Mongoose connected'))
    .catch(err => console.log('Connection error:', err));

const zones = ['East', 'West', 'North', 'South'];
const totalEmployees = 3000;
const employeeNames = Array.from({ length: totalEmployees }, (_, i) => `Employee ${i + 1}`);

async function seedEmployees() {
  await Employee.deleteMany({});
  let employees = [];

  for (let i = 0; i < totalEmployees; i++) {
    let randomZones = [...zones].sort(() => 0.5 - Math.random()).slice(0, 2); // Pick 2 preferred zones
    employees.push({
      name: employeeNames[i],
      preferredZones: randomZones,
      centralZoneDays: 0,
      status: 'Active',
      designation: ['TSI', 'HC', 'C'][Math.floor(Math.random() * 3)], // Random designation
      Ldate: new Date('1900-04-01'),
      leaveDates: [] // ✅ initialize empty array to avoid undefined issues
    });
  }

  await Employee.insertMany(employees);
  console.log("✅ 3,000 Employees Seeded!");
}

// Run Seeder
async function seedDatabase() {
  await seedEmployees();
  mongoose.connection.close();
}

seedDatabase().catch(err => console.error(err));
