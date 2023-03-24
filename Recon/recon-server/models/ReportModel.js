const mongoose = require("mongoose")
const schemaName = "reports"

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://root:root@survey.oaptacj.mongodb.net/?retryWrites=true&w=majority";
/*const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

console.log("inside ReportModel")
//mongoose.connect("mongodb://localhost:27017/recon", {
mongoose.connect(uri, {
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
  createdByUser: {
    type: String,
    required: [true, 'submission must be linked to a user']
  },
  createdForUser: {
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