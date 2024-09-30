const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://vinokannusamy:Gk%40mongodb1@cluster0.cn1sj.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Claim Schema
const claimSchema = new mongoose.Schema({
  policyholderId: String,
  policyNumber: String,
  claimType: String,
  severity: String,
  status: String,
  documentUrl: String,
  submissionDate: Date,
  incidentDescription: String,
  claimAmount: Number,
});

// Create the Claim Model
const Claim = mongoose.model('CholaIns-Claim', claimSchema);

// #### Claim Submission API ####
app.post('/submit-claim', async (req, res) => {
  const { policyholderId, policyNumber, claimType, severity, documentUrl, incidentDescription, claimAmount } = req.body;

  // Create a new claim
  const newClaim = new Claim({
    policyholderId,
    policyNumber,
    claimType,
    severity,
    status: 'Pending',
    documentUrl,
    incidentDescription,
    claimAmount,
    submissionDate: new Date(),
  });

  try {
    await newClaim.save();
    res.status(200).json({ message: 'Claim submitted successfully', claimId: newClaim._id });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting claim', error });
  }
});

// #### Edit (Update) API ####
app.put('/edit-claim/:claimId', async (req, res) => {
  const { claimId } = req.params;
  const { policyholderId, policyNumber, claimType, severity, documentUrl, incidentDescription, claimAmount, status } = req.body;

  try {
    // Find the claim by ID and update it
    const updatedClaim = await Claim.findByIdAndUpdate(
      claimId,
      {
        policyholderId,
        policyNumber,
        claimType,
        severity,
        documentUrl,
        incidentDescription,
        claimAmount,  // Ensure claimAmount is passed
        status,  // Ensure status is passed
      },
      { new: true }  // Return the updated document
    );

    if (!updatedClaim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json({
      message: 'Claim updated successfully',
      updatedClaim
    });
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({ message: 'Error updating claim', error });
  }
});

// Start the server
app.listen(8001, () => {
  console.log('Claim Submission service running on port 8001');
});
