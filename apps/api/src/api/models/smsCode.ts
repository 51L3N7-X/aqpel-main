import mongoose from "mongoose";

const smsCodeSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  code: { type: String },
  createdAt: { type: Date, expires: 120 },
});

export const smscode = mongoose.model("smscodes", smsCodeSchema);
