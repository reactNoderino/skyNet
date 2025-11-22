const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Pano başlığı gereklidir"],
      trim: true,
      minlength: [1, "Başlık en az 1 karakter olmalıdır"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Board", boardSchema);
