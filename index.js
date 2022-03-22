const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();

const { PORT, API_KEY, DB_NAME } = process.env;

app.use(cors());

app.post('/post', express.urlencoded({ extended: true }), express.json(), (req, res) => {
  const user = req.body;

  const sender = req.headers['amp-email-sender'];
  console.log('Sender: ' + sender);

  // check if the sender is the right person (if the user is legitimate and is the one who's meant to use this api (to receive the email))
  // if not, block the request
  if (!sender) {
    return res.status(403).send('This endpoint is not meant for you.');
  }

  res.setHeader('AMP-Email-Allow-Sender', sender);

  axios
    .post(`https://${DB_NAME}.restdb.io/rest/quick`, user, {
      headers: {
        'x-apikey': API_KEY,
      },
    })
    .then(() => res.send(user));
  console.log(user);
});

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

  return res.send({ items: [trackingDetails] });
});

const server = app.listen(PORT || 4000, () => {
  console.log(`Server is listening at port ${server.address().port}`);
});
