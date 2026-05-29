const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../MODELS/listing");

const mongoUrl = "mongodb://127.0.0.1:27017/airbnb";

async function main() {
    await mongoose.connect(mongoUrl);
}

main().then(()=>{
    console.log("DB Connected");
}).catch(err=>{
    console.log(err);
})

const initDB = async () => {
   await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({
    ...obj,
    owner: "6a0f59475f8805399de365fa"
   }))
   await Listing.insertMany(initdata.data);
   console.log(initdata.data);
   console.log("Data Initialized");
}

initDB();