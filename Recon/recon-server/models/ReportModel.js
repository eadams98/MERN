const mongoose = require("mongoose")
const schemaName = "reports"

console.log("inside ReportModel")
mongoose.connect("mongodb://localhost:27017/recon", {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log(`DB report connection successful!`))
.catch((err)=>{console.log("error"); console.log(err);})

const reportSchema = new mongoose.Schema({
  grade: {
    type: String,
    required: [true, 'grade is mandatory']
  },
  submissionDate: {
    type: Date,
    required: [true, 'submission date is mandatory']
  },
  forWeek: {
    start: {
      type: Date,
      required: [true, 'start date is mandatory']
    },
    end: {
      type: Date,
      required: [true, 'end date is mandatory']
    }
  },
  description: {
    type: String,
  },
  user: {
    type: String,
    required: [true, 'submission must be linked to a user']
  }
},
{
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
})

// Model
const ReportModel = mongoose.model('reports', reportSchema)
module.exports = ReportModel