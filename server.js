const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json()); 

mongoose.connect("mongodb://localhost:27017/leads", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const leadSchema = new mongoose.Schema({
  name: String,
  contact: String,
  status: String,
  priority: String,
  source: String,
});

const Lead = mongoose.model("Lead", leadSchema);

// Get the most recently added lead
app.get("/api/leads/latest", async (req, res) => {
    try {
      const latestLead = await Lead.findOne().sort({ _id: -1 }); // Sort by descending ID
      if (!latestLead) {
        return res.status(404).json({ message: "No leads found" });
      }
      res.json(latestLead); // Send the latest lead's data
    } catch (err) {
      res.status(500).json({ message: "Error fetching latest lead", error: err.message });
    }
  });
  
  


// GET all leads
app.get("/api/leads", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads", error });
  }
});

// GET a single lead by ID
app.get("/api/leads/:_id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lead details", error });
  }
});

// POST a new lead
app.post("/api/leads", async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.json(newLead);
  } catch (error) {
    res.status(500).json({ message: "Error saving lead", error });
  }
});

// PUT update lead status
app.put("/api/leads/:id", async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Error updating lead", error });
  }
});

// DELETE a lead
app.delete("/api/leads/:id", async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead", error });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
