const mongoose = require("mongoose");

const saveDataSchema = new mongoose.Schema(
  {
    UserCode: { type: Number, default: 0 },
    PlayerMoney: { type: Number, default: 0 },
    PlayerEnergy: { type: Number, default: 0 },
    AchievementsCompleted: { type: Number, default: 0 },
    WealthScore: { type: Number, default: 0 },
    updatedAt: { type: Number, default: 0 },
  },
  { _id: false }
);

const saveSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true, index: true },
    version: { type: Number, default: 1 },
    data: { type: saveDataSchema, default: () => ({}) }, // <-- renamed
  },
  { timestamps: true }
);

module.exports = mongoose.model("save", saveSchema);