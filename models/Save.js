const mongoose = require("mongoose");

const saveDataSchema = new mongoose.Schema(
  {
    UserCode: { type: Number, default: 0 },
    PlayerMoney: { type: Number, default: 0 },
    PlayerEnergy: { type: Number, default: 0 },
    AchievementsCompleted: { type: Number, default: 0 },
    WealthScore: { type: Number, default: 0 },
    SmallPlanePurchased: { type: Boolean, default: false },
    PrivateJetPurchased: { type: Boolean, default: false },
    CommercialPlanePurchased: { type: Boolean, default: false },
    CasinoBusinessPurchased: { type: Boolean, default: false },
    CarDealershipBusinessPurchased: { type: Boolean, default: false },
    RestrauntBusinessPurchased: { type: Boolean, default: false },
    EastDrivePropertyPurchased: { type: Boolean, default: false },
    BlessfrontAvenuePropertyPurchased: { type: Boolean, default: false },
    DartbackAvenuePropertyPurchased: { type: Boolean, default: false },
    HatchbackPurchased: { type: Boolean, default: false },
    SedanPurchased: { type: Boolean, default: false },
    SUVPurchased: { type: Boolean, default: false },
    SportsCarPurchased: { type: Boolean, default: false },
    SuperCarPurchased: { type: Boolean, default: false },
    HyperCarPurchased: { type: Boolean, default: false },
    Achievement1Unlocked: { type: Boolean, default: false },
    Achievement2Unlocked: { type: Boolean, default: false },
    Achievement3Unlocked: { type: Boolean, default: false },
    Achievement4Unlocked: { type: Boolean, default: false },
    updatedAt: { type: Number, default: 0 },
  },
  { _id: false }
);

const saveSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true, index: true },
    version: { type: Number, default: 1 },
    data: { type: saveDataSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("save", saveSchema);