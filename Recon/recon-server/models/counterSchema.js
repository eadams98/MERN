const mongoose = require("mongoose");

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://root:root@survey.oaptacj.mongodb.net/?retryWrites=true&w=majority";
/*const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/

//mongoose.connect("mongodb://localhost:27017/recon", {
mongoose.connect(uri, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log(`DB counter connection successful!`))
.catch((err)=>{console.log("error"); console.log(err);})

const CounterSchema = new mongoose.Schema({
  schemaName: {
    type: String,
    required: [true, 'schema name is mandatory']
  },
  counter: {
    type: Number,
    default: 1
  },
},
{
  timestamps: {
    createdAt: true,
    updatedAt: true
  }
})

// Model
const CounterModel = mongoose.model('counters', CounterSchema)
module.exports = CounterModel