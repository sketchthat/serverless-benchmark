/*
  Amazon Web Services: Lambda
*/
exports.handler = function(_event, _context, callback) {
  const date = Date.now();

  callback(null, { statusCode: 200, body: JSON.stringify({ date }) });
};
