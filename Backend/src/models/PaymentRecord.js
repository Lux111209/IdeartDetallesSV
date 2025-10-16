import { Schema, model } from "mongoose";

const paymentRecordSchema = new Schema(
  {
    userName: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentLink: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("PaymentRecord", paymentRecordSchema);
