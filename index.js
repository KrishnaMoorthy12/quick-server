const express = require('express');
const axios = require('axios');

require('dotenv').config();

const app = express();

const { PORT, API_KEY, DB_NAME } = process.env;

app.post('/post', express.urlencoded({ extended: true }), express.json(), (req, res) => {
  const user = req.body;

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
