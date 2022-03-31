module.exports = function protectRoute(req, res, next) {
  const sender = req.headers['amp-email-sender'];
  console.log('Sender: ' + sender);

  // check if the sender is the right person (if the user is legitimate and is the one who's meant to use this api (to receive the email))
  // if not, block the request
  if (!sender) {
    return res.status(403).send('This endpoint is not meant for you.');
  }

  res.setHeader('AMP-Email-Allow-Sender', sender);

  next();
};
