// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
});

UserSchema.pre("save", async function(next) {
  if(!this.isModified("password")){
    next();
  }
  this.password= await bcrypt.hash(this.password, 10)
})

UserSchema.methods.comparePassword = async function(enterdpassword) {
  return await bcrypt.compare(enterdpassword, this.password)
}

UserSchema.methods.generateJsonWebToken = function(){
  return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY,{
    expiresIn:process.env.JWT_EXPIRES
  })
}

export const User= mongoose.model('User', UserSchema);

