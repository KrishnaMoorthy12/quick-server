const axios = require('axios');
const express = require('express');
const protectRoute = require('./protect-route.middleware');

const router = express.Router();

const { API_KEY, DB_NAME } = process.env;

const api = axios.create({
  baseUrl: `https://${DB_NAME}.restdb.io/rest/`,
  headers: {
    'x-apikey': API_KEY,
  },
});

router.post(
  '/post',
  express.urlencoded({ extended: true }),
  express.json(),
  protectRoute,
  (req, res) => {
    const user = req.body;
    api.post('/quick', user).then(() => res.send(user));
    console.log(user);
  }
);

router.post(
  '/survey',
  express.json(),
  express.urlencoded({ extended: true }),
  protectRoute,
  (req, res) => {
    const { fullName, age, dateOfJoining } = req.body;
    const survey = { fullName, age, dateOfJoining };
    api.post('/survey', survey).then(() => res.send(survey));
    console.log(survey);
  }
);

export default router;
