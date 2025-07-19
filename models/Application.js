const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String, required: true },
  resume: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
