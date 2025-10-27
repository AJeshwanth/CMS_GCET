/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ========================= DATABASE CONNECTION =========================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========================= SCHEMAS =========================

// User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, default: "student" },
});
const User = mongoose.model("User", userSchema, "USERS");

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  submittedBy: { type: String, required: true },
  category: { type: String, default: "General" },
  location: { type: String, default: "Not specified" },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const Complaint = mongoose.model("Complaint", complaintSchema, "COMPLAINTS");

// Issue Schema (for forwarding)
const issueSchema = new mongoose.Schema({
  issue: { type: String, required: true },
  id: String,
  password: String,
  email: String,
});
const Issue = mongoose.model("Issue", issueSchema, "DEPARTMENTS");

// ========================= ROUTES =========================

// LOGIN API
app.post("/login", async (req, res) => {
  const { id, password } = req.body;
  console.log("Request body:", req.body);
  const user = await User.findOne({ id });
  console.log("User found:", user);
  if (!id || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Roll No and Password required" });
  }

  try {
    if (id === "admin" && password === "hello") {
      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        role: "admin"
      });
    }
    const dept=await Issue.findOne({id})
    if(!dept){
      const user = await User.findOne({ id });
      if (!user)
        return res.status(401).json({ success: false, message: "User not found" });
      if (user.password !== password)
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password" });

      return res
        .status(200)
        .json({ success: true, message: "Login successful", role: "user" });
    }else{
      if (dept.password !== password)
        return res
      .status(401)
      .json({ success: false, message: "Incorrect password" });
      console.log("department")
      return res
        .status(200)
        .json({ success: true, message: "Login successful", role : "department" , "issue":dept.issue});
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET COMPLAINTS
app.get("/api/complaints", async (req, res) => {
  try {
    const { role, userId, category } = req.query;
    let filter = {};

    if (role === "user" && userId) {
      filter.submittedBy = userId;
    } else if (role === "department" && category) {
      filter.category = category;
    } 
    // admin sees all complaints

    const complaints = await Complaint.find(filter);
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ADD COMPLAINT
app.post("/api/complaints", async (req, res) => {
  const { title, description, submittedBy, category, location } = req.body;

  if (!title || !description || !submittedBy) {
    return res.status(400).json({ error: "Incomplete complaint data" });
  }

  try {
    const complaint = new Complaint({
      title,
      description,
      submittedBy,
      category,
      location,
    });
    await complaint.save();
    res
      .status(201)
      .json({ message: "Complaint submitted successfully", complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE COMPLAINT STATUS
app.patch("/api/updatecomplaints/:id", async (req, res) => {
  const { status } = req.body;
  const complaintId = req.params.id;

  if (!status) return res.status(400).json({ error: "Status is required" });
  if (!mongoose.Types.ObjectId.isValid(complaintId))
    return res.status(400).json({ error: "Invalid complaint ID" });

  try {
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    if (!complaint)
      return res.status(404).json({ error: "Complaint not found" });

    res.json({ message: "Status updated successfully", complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT COMPLAINT DETAILS
app.patch("/api/editcomplaints/:id", async (req, res) => {
  const { description, status, category } = req.body;

  if (!description && !status && !category) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  try {
    const updateFields = {};
    if (description) updateFields.description = description;
    if (status) updateFields.status = status;
    if (category) updateFields.category = category;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    res
      .status(200)
      .json({ message: "Complaint updated successfully", complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE COMPLAINT
app.delete("/api/deletecomplaints/:id", async (req, res) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!deletedComplaint)
      return res.status(404).json({ error: "Complaint not found" });

    res
      .status(200)
      .json({ message: "Complaint deleted successfully", deletedComplaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================= FORWARD COMPLAINT =========================
app.post("/api/forward/:id", async (req, res) => {
  try {
    const complaintId = req.params.id;
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Find the corresponding issue by category
    const issueDoc = await Issue.findOne({ issue: complaint.category });
    if (!issueDoc) {
      return res
        .status(404)
        .json({ message: "No issue found for this complaint category" });
    }

    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: issueDoc.email,
      subject: `New Complaint Forwarded: ${complaint.title}`,
      text: `A new complaint has been forwarded to your department.

Issue: ${complaint.category}
Title: ${complaint.title}
Description: ${complaint.description}
Location: ${complaint.location}
Submitted By: ${complaint.submittedBy}
Status: ${complaint.status}

Please take necessary action.`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Complaint "${complaint.title}" forwarded to ${issueDoc.email}`);
    res.json({ message: `Complaint forwarded to ${issueDoc.email}` });
  } catch (err) {
    console.error("❌ Error forwarding complaint:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ========================= SERVER START =========================
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
module.exports = app;
