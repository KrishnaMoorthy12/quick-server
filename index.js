const express = require('express');
const cors = require('cors');
require('dotenv').config();

const formsHandler = require('./forms');
const eShoppingHandler = require('./shopping');
const { PORT } = process.env;

const app = express();

app.use(cors());

app.use(formsHandler);
app.use(eShoppingHandler);

app.get('/track', (req, res) => {
  const { trackingId } = req.query;

  const trackingDetails = {
    trackingId,
    orderedOn: new Date('03-15-2022'),
    currentState: 'Out for delivery',
    lastUpdated: new Date('03-21-2022'),
    eta: new Date('03-22-2022'),
  };

  const sender = req.headers['amp-email-sender'];
  console.log(`Sender: ${sender}`);

  if (!sender) {
    return res.status(403).send('This endpoint is not meant for you.');
  }

  res.setHeader('AMP-Email-Allow-Sender', sender);

  return res.send(trackingDetails);
});

const server = app.listen(PORT || 4000, () => {
  console.log(`Server is listening at port ${server.address().port}`);
});
