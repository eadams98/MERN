const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/recon", {
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