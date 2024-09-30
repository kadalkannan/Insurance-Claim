const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://vinokannusamy:Gk%40mongodb1@cluster0.cn1sj.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

const Claim = mongoose.model('Claim', new mongoose.Schema({
  policyholderId: String,
  claimType: String,
  severity: String,
  status: String,
  documentUrl: String,
  submissionDate: Date,
}));

// Claim triage API
app.post('/triage-claim/:id', async (req, res) => {
  const claimId = req.params.id;
  const claim = await Claim.findById(claimId);
  
  // Categorize the claim based on type and severity
  if (claim.severity === 'High') {
    claim.status = 'Urgent';
  } else {
    claim.status = 'Normal';
  }

  await claim.save();
  res.status(200).json({ message: 'Claim triaged successfully', status: claim.status });
});

app.listen(3002, () => {
  console.log('Claim Triage service running on port 3002');
});
