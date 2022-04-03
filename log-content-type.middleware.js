module.exports = function logContentType(req, res, next) {
  console.log(
    'Content Type: ',
    req.headers['content-type'] || req.headers['Content-Type'] || req.headers.ContentType
  );
  next();
};
