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
    axios
      .post(`https://${DB_NAME}.restdb.io/rest/quick`, user, {
        headers: { 'x-apikey': API_KEY },
      })
      .then(() => res.send(user))
      .catch(e => console.log('WTF'));
    console.log(user);
  }
);

router.get('/is-survey-submitted/:userId', protectRoute, async (req, res) => {
  const requesterId = req.params.userId;
  if (!requesterId) return res.status(401).send({ message: 'Unauthorized' });

  const submittedUsers = (
    await axios.get(`https://${DB_NAME}.restdb.io/rest/survey`, {
      headers: { 'x-apikey': API_KEY },
    })
  ).data;

  if (submittedUsers.find(user => user.userId === requesterId))
    return res.json({ message: 'User has submitted the survey', submitted: true });

  return res.json({ message: 'User has not submitted the form' });
});

router.post(
  '/survey',
  express.json(),
  express.urlencoded({ extended: true }),
  protectRoute,
  (req, res) => {
    const { fullName, age, dateOfJoining, userId } = req.body;
    console.log(req.body);
    const survey = { fullName, age: +age, dateOfJoining: new Date(dateOfJoining), userId };
    axios
      .post(`https://${DB_NAME}.restdb.io/rest/survey`, survey, {
        headers: { 'x-apikey': API_KEY },
      })
      .then(() => res.send(survey));
    console.log(survey);
  }
);

module.exports = router;
