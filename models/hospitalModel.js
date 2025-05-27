const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const hospitalSchema = mongoose.Schema(
  {
    hospital: {
      type: String,
      required: [true, "User name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: { type: String, required: [true, "Password is require"] },
    Address: { type: String },
    no_vac_available: { type: Number, default: 0 },
    pending_list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    code: { type: String, required: [true, "code is required"], unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("hospitals", hospitalSchema);
