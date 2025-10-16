const mongoose = require("mongoose");

const paymentRecordSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentLink: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentRecord", paymentRecordSchema);
