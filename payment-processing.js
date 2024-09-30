const express = require('express');
const axios = require('axios');
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

// Payment processing API
app.post('/process-payment/:id', async (req, res) => {
  const claimId = req.params.id;
  const claim = await Claim.findById(claimId);

  if (claim.status === 'Approved') {
    try {
      // Call external payment gateway API (e.g., Stripe)
      const paymentResponse = await axios.post('https://api.stripe.com/v1/payments', { amount: 100 });
      res.status(200).json({ message: 'Payment processed', paymentResponse });
    } catch (error) {
      res.status(500).json({ message: 'Payment failed', error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Claim not approved for payment' });
  }
});

app.listen(3003, () => {
  console.log('Payment Processing service running on port 3003');
});
