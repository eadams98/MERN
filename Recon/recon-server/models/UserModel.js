const mongoose = require("mongoose")
const schemaName = "users"

mongoose.connect("mongodb://localhost:27017/recon", {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log(`DB user connection successful!`))
.catch((err)=>{console.log("error"); console.log(err);})

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: [true, 'user ID is mandatory']
  },
  emailID: {
    type: String,
    required: [true, 'user ID is mandatory']
  },
  password: {
    type: String,
    required: [true, 'password is mandatory']
  },
  name: {
    first: { 
      type: String, 
      required: [true, 'first name is mandatory']
    },
    last: { 
      type: String,
      required: [true, 'last name is mandatory']
    }
  },
  role: {
    type: String, //Council, School, Contractor, Jr. Devloper
    required: [true, 'user role is mandatory']
  },
  connections: {
    type: Array, // userIDs (admin will always be empty. jr will only have 1, everyone else can have multiple)
    default: []
  },
  access: {
    type: Array,
    default: []
  },
  userImage: {
    type: String,
  }
},
{
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
})

// Model
const UserModel = mongoose.model('users', userSchema)
module.exports = UserModel