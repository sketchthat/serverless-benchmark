/*
  Google Cloud Platform: Cloud Functions
*/
exports.coldStart = (_req, res) => {
  const date = Date.now();

  res.send({
    date,
  });
}
