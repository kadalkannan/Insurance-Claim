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

// Generate report API
app.get('/report', async (req, res) => {
  const claimCounts = await Claim.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  res.status(200).json({ message: 'Report generated', data: claimCounts });
});

app.listen(3004, () => {
  console.log('Reporting service running on port 3004');
});
