import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Mongodb Database Connected.");
    })
    .catch((error) => {
      console.log(`Mongodb error: ${error}`);
    });
};
export default connectDB;

// mongoose.connect(MONGO_URI).then(()=>{
//     console.log("Mongodb Database Connected.")
// }).catch((error)=>{
//     console.log(`Mongodb error: ${error}`)
// })
