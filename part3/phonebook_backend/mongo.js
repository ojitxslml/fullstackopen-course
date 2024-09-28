const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://0x5:${password}@fullstack.2qc03.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
});

if (process.argv.length < 4){
    Person.find({}).then((result) => {
        console.log("phonebook:");
        result.forEach((person) => {
          console.log(`${person.name} ${person.number}`)
        });
        mongoose.connection.close();
      });
}else{
//to save a person into database
person.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  }) 
}


