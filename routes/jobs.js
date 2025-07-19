const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {

  const skillsArray = req.body.skills.split(",").map(skill => skill.trim());

  const job = await Job.create({ ...req.body, skills: skillsArray, postedBy: req.user.id });
  res.status(201).json(job);
});

router.get("/", auth, async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user.id });
  res.json(jobs);
});

router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching all jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/:id", auth, async (req, res) => {
  try {
    const jobId = req.params.id;

    const skillsArray = req.body.skills.split(",").map(skill => skill.trim());

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { ...req.body, skills: skillsArray, postedBy: req.user.id },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findOne({ _id: jobId, postedBy: req.user.id });
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    await Job.findByIdAndDelete(jobId);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
