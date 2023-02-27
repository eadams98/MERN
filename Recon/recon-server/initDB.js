const CounterModel = require("./models/counterSchema");
const ReportModel = require("./models/ReportModel");
const UserModel = require("./models/UserModel");

const userDocuments = [
  {
    userID: 'ADMIN',
    emailID: 'admin@yahoo.com',
    password: 'Test@123',
    name: { first: 'eric', last: 'adams' },
    role: 'ADMIN',
    access: []
  },
  {
    userID: 'JR-CONTRACTOR-001',
    emailID: 'trainee.1@yahoo.com',
    password: 'Test@123',
    name: { first: 'Trainee', last: '1' },
    role: 'JR. CONTRACTOR',
    connections: [ 'CONTRACTOR-001', 'SCHOOL-001' ],
    access: [],
  },
  {
    userID: 'JR-CONTRACTOR-002',
    emailID: 'trainee.2@yahoo.com',
    password: 'Test@123',
    name: { first: 'Trainee', last: '2' },
    role: 'JR. CONTRACTOR',
    connections: [],
    access: [],
  },
  {
    userID: 'JR-CONTRACTOR-003',
    emailID: 'trainee.3@yahoo.com',
    password: 'Test@123',
    name: { first: 'Trainee', last: '3' },
    role: 'JR. CONTRACTOR',
    connections: [ 'CONTRACTOR-001', 'SCHOOL-001' ],
    access: [],
  },
  {
    userID: 'JR-CONTRACTOR-004',
    emailID: 'trainee.4@yahoo.com',
    password: 'Test@123',
    name: { first: 'Trainee', last: '4' },
    role: 'JR. CONTRACTOR',
    connections: [ 'CONTRACTOR-002', 'SCHOOL-001' ],
    access: [],
  },
  {
    userID: 'JR-CONTRACTOR-005',
    emailID: 'trainee.5@yahoo.com',
    password: 'Test@123',
    name: { first: 'Trainee', last: '5' },
    role: 'JR. CONTRACTOR',
    connections: [],
    access: [],
  },
  {
    userID: 'CONTRACTOR-001',
    emailID: 'contractor.1@yahoo.com',
    password: 'Test@123',
    name: { first: 'contractor', last: '1' },
    role: 'CONTRACTOR',
    connections: [ 'JR-CONTRACTOR-001', 'JR-CONTRACTOR-003' ],
    access: [],
    userImage: 'profile-pictures/CONTRACTOR-001.jpg'
  },
  {
    userID: 'CONTRACTOR-002',
    emailID: 'contractor.2@yahoo.com',
    password: 'Test@123',
    name: { first: 'Contractor', last: '2' },
    role: 'CONTRACTOR',
    connections: [ 'JR-CONTRACTOR-004' ],
    access: [],
  },
  {
    userID: 'CONTRACTOR-003',
    emailID: 'contractor.3@yahoo.com',
    password: 'Test@123',
    name: { first: 'Contractor', last: '3' },
    role: 'CONTRACTOR',
    connections: [],
    access: [],
  },
  {
    userID: 'SCHOOL-001',
    emailID: 'school.1@yahoo.com',
    password: 'Test@123',
    name: { first: 'School', last: '1' },
    role: 'SCHOOL',
    connections: [ 'JR-CONTRACTOR-001', 'JR-CONTRACTOR-003', 'JR-CONTRACTOR-004' ],
    access: [],
  },
  {
    userID: 'SCHOOL-002',
    emailID: 'school.2@yahoo.com',
    password: 'Test@123',
    name: { first: 'School', last: '2' },
    role: 'SCHOOL',
    connections: [],
    access: [],
  },
  {
    userID: 'COUNCIL-001',
    emailID: 'council.1@yahoo.com',
    password: 'Test@123',
    name: { first: 'Council', last: '1' },
    role: 'COUNCIL',
    connections: [],
    access: [],
  },
  {
    userID: 'COUNCIL-002',
    emailID: 'council.2@yahoo.com',
    password: 'Test@123',
    name: { first: 'Council', last: '2' },
    role: 'COUNCIL',
    connections: [],
    access: [],
  }
]
counterDocuments = [
  {
    schemaName: "users-jr. contractor",
    counter: "6"
  },
  {
    schemaName: "users-contractor",
    counter: "4"
  },
  {
    schemaName: "users-school",
    counter: "3"
  },
  {
    schemaName: "users-council",
    counter: "3"
  }
]

exports.CleanDB = async () => {
  await UserModel.deleteMany({})
  await ReportModel.deleteMany({})
  await CounterModel.deleteMany({})
  console.log("Deleted DB")

  await UserModel.create(userDocuments)
  await CounterModel.create(counterDocuments)
  console.log("created documents")
}

