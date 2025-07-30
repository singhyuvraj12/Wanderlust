const mongoose = require("mongoose");
const { data } = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then((res) => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  await mongoose.connect("mongodb+srv://2022021243:UMqsCmM04ofbajD4@cluster0.mrj9ptx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    let newData = data.map((obj)=>({...obj , owner:"67ef736c0789ee3ed5a4deba"}));
    await Listing.insertMany(newData);
    console.log("data enter successfully");
}

initDB();