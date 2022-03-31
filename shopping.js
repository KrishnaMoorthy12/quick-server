const express = require('express');
const router = express.Router();

const appState = {};

router.post('/add-to-cart', express.urlencoded({ extended: true }), express.json(), (req, res) => {
  const { items } = req.body;

  console.log({ items });

  const cart = items.split(',');
  appState.userCart = cart;

  console.log(appState);
  res.setHeader('AMP-Email-Allow-Sender', '*');

  res.send({ message: 'Successfully added to cart' });
});

router.get('/checkout', (_req, res) => {
  res.send(`<html>
    <body>
    <ol>
    ${appState.userCart.map(item => '<ul>' + item + '</ul>')}
    </ol>
    </body>
  </html>`);
});

router.get('/products', (req, res) => {
  res.setHeader('AMP-Email-Allow-Sender', '*');

  const products = [
    {
      id: 'product1',
      name: 'Product 1',
      price: '$20',
      image: 'https://unsplash.com/photos/m1MRYp556Ew/download?force=true&w=640',
      link: 'example.com',
    },
    {
      id: 'product2',
      name: 'Product 2',
      price: '$24',
      image: 'https://unsplash.com/photos/Wr0TpKqf26s/download?force=true&w=640',
      link: 'example.com',
    },
    {
      id: 'product3',
      name: 'Product 3',
      price: '$28',
      image: 'https://unsplash.com/photos/PTorAkUcYHg/download?force=true&w=640',
      link: 'example.com',
    },
  ];

  res.send({ items: products });
});

module.exports = router;
