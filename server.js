const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/users");
const applicationRoutes = require("./routes/application");
const adminRoutes = require("./routes/admin");
const fs = require('fs');
const path = require('path');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

dotenv.config();
const app = express();


const allowedOrigins = [
  'http://localhost:5173',
  'https://jobportal-frontend-black-eta.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.options("*", cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/admin", adminRoutes);

app.use("/uploads", express.static("uploads"));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
