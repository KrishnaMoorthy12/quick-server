const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();

const appState = {};

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

app.post('/add-to-cart', (req, res) => {
  const { items } = req.query;
  const cart = items.split(',');
  appState.userCart = cart;

  const sender = req.headers['amp-email-sender'];
  if (!sender) return res.status(403).send('This endpoint is not meant for you.');
  res.setHeader('AMP-Email-Allow-Sender', sender);

  res.send('Successfully added to cart');
});

app.get('/checkout', (req, res) => {
  res.send(`<html>
    <body>
    <ol>
    ${appState.userCart.map(item => '<ul>' + item + '</ul>')}
    </ol>
    </body>
  </html>`);
});

app.get('/products', (req, res) => {
  const sender = req.headers['amp-email-sender'];
  if (!sender) return res.status(403).send('This endpoint is not meant for you.');

  res.setHeader('AMP-Email-Allow-Sender', sender);

  const products = [
    {
      id: 'product1',
      name: 'Product 1',
      price: '$20',
      image: 'https://unsplash.com/photos/m1MRYp556Ew',
    },
    {
      id: 'product2',
      name: 'Product 2',
      price: '$24',
      image: 'https://unsplash.com/photos/Wr0TpKqf26s',
    },
    {
      id: 'product3',
      name: 'Product 3',
      price: '$28',
      image: 'https://unsplash.com/photos/PTorAkUcYHg',
    },
  ];

  res.send({ items: products });
});

const server = app.listen(PORT || 4000, () => {
  console.log(`Server is listening at port ${server.address().port}`);
});
