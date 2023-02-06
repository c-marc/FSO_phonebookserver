const mongoose = require("mongoose");

//const url = `mongodb+srv://fullstack:${password}@cluster0.4tnxb2a.mongodb.net/phoneApp?retryWrites=true&w=majority`;
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// node module export
module.exports = mongoose.model("Person", noteSchema);
