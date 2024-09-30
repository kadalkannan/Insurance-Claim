const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

// Connect to MongoDB (use your MongoDB connection string)
mongoose.connect('mongodb+srv://vinokannusamy:Gk%40mongodb1@cluster0.cn1sj.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Claim Schema (should match the schema from claim-submission.js)
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
  verificationNotes: String,     // Added for verification process
  verifiedBy: String,            // Added for verification process
  verificationDate: Date,        // Added for verification process
  PaymentApproval: String,
  PaymentverificationNotes: String,
  PaymentverifiedBy: String,
  ApprovedAmount: Number
});

const Claim = mongoose.model('CholaIns-Claim', claimSchema);

// #### API to Get All Pending Claims ####
app.get('/pending-claims-Payment', async (req, res) => {
  try {
    const pendingClaims = await Claim.find({ status: 'Approved' });
    res.status(200).json(pendingClaims);
  } catch (error) {
    console.error('Error fetching pending claims:', error);
    res.status(500).json({ message: 'Error fetching pending claims', error });
  }
});

// #### API to Verify a Claim ####
app.put('/claim-approval/:claimId', async (req, res) => {
  const { claimId } = req.params;
  const { PaymentApproval, PaymentverificationNotes, PaymentverifiedBy,ApprovedAmount } = req.body;

  if (!['Approved', 'Rejected'].includes(PaymentApproval)) {
    return res.status(400).json({ message: 'Invalid status. Use "Approved" or "Rejected".' });
  }

  try {
    // Update the claim status and add verification details
    const updatedClaim = await Claim.findByIdAndUpdate(
      claimId,
      {
        PaymentApproval,
        PaymentverificationNotes,
        PaymentverifiedBy,
        PaymentverificationDate: new Date(),
        ApprovedAmount
      },
      { new: true }
    );

    if (!updatedClaim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json({
      message: `Claim ${PaymentApproval.toLowerCase()} successfully`,
      updatedClaim,
    });
  } catch (error) {
    console.error('Error verifying claim:', error);
    res.status(500).json({ message: 'Error verifying claim', error });
  }
});

// #### API to Fetch a Specific Claim by ID ####
app.get('/claim/:claimId', async (req, res) => {
  const { claimId } = req.params;

  try {
    const claim = await Claim.findById(claimId);

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json(claim);
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ message: 'Error fetching claim', error });
  }
});

// #### Start the Server ####
app.listen(8002, () => {
  console.log('Claim Verification service running on port 8002');
});
