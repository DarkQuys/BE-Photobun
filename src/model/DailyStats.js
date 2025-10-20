// const mongoose = require("mongoose");

// const DailyStatsSchema = new mongoose.Schema({
//   date: { type: String, required: true }, // ví dụ "2025-10-17"
//   room: { type: String, enum: ["phong1", "phong2", "phong3"], required: true },
//   totalShots: { type: Number, default: 0 },
//   totalIncome: { type: Number, default: 0 },
// });

// const DailyStats = mongoose.model("DailyStats", DailyStatsSchema);
// module.exports = DailyStats;

const mongoose = require("mongoose");

const RoomStatsSchema = new mongoose.Schema({
  totalShots: { type: Number, default: 0 },
  totalIncome: { type: Number, default: 0 },
});

const DailyStatsSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // ví dụ "2025-10-17"
  stats: {
    phong1: { type: RoomStatsSchema, default: () => ({}) },
    phong2: { type: RoomStatsSchema, default: () => ({}) },
    phong3: { type: RoomStatsSchema, default: () => ({}) },
  },
  totalShots: { type: Number, default: 0 },
  totalIncome: { type: Number, default: 0 },
});

const DailyStats = mongoose.model("DailyStats", DailyStatsSchema);
module.exports = DailyStats;
