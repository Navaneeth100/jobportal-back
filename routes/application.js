const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

const Application = require("../models/Application");

// 🔧 File storage config using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save resumes here
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// ✅ Apply to a job
router.post("/apply", auth, upload.single("resume"), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId || !coverLetter || !req.file) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newApplication = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume: req.file.filename,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all applications for logged-in applicant
router.get("/mine", auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id }).populate("job");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
