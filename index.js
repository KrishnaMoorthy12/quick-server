const express = require('express');
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express();

const { PORT, API_KEY, DB_NAME } = process.env;

app.use(cors());

app.post('/post', express.urlencoded({ extended: true }), express.json(), (req, res) => {
  const user = req.body;
  
  console.log(req.headers);
  res.setHeader('AMP-Email-Allow-Sender', '*');

  axios
    .post(`https://${DB_NAME}.restdb.io/rest/quick`, user, {
      headers: {
        'x-apikey': API_KEY,
      },
    })
    .then(() => res.send(user));
  console.log(user);
});

const server = app.listen(PORT || 3000, () => {
  console.log(`Server is listening at port ${server.address().port}`);
});
