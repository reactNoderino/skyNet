const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Kart başlığı gereklidir"],
      trim: true,
      minlength: [1, "Başlık en az 1 karakter olmalıdır"],
    },
    description: {
      type: String,
      required: [true, "Kart açıklaması gereklidir"],
      trim: true,
      minlength: [1, "Açıklama en az 1 karakter olmalıdır"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Without"],
      default: "Without",
    },
    deadline: {
      type: Date,
      default: null,
    },
    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Card", cardSchema);
