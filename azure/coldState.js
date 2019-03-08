/*
  Microsoft Azure: Functions
*/
module.exports = (context, _req) => {
  const date = Date.now();

  context.res = {
      body: {
          date,
      }
  };

  context.done();
};
