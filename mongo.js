const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.4tnxb2a.mongodb.net/phoneApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// fetch
if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({})
    .then((result) => {
      result.forEach((p) => {
        console.log(p.name, " ", p.number);
      });
      mongoose.connection.close();
    })
    .then(() => process.exit(1));
}

// post
if (process.argv.length === 4) {
  console.log("must provide name and number");
  process.exit(1);
}

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log("person saved!");
    mongoose.connection.close();
  });
}
