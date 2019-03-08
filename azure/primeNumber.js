module.exports = async function (context, req) {
  let n = 0;
  const maxCount = 100000;
  const primes = [];

  const isPrime = num => {
    const sqrt = Math.sqrt(num);

    for (let i = 2; i <= sqrt; i++) {
      if (num % i === 0) {
        return false;
      }
    }

    return num >= 2;
  }

  const start = Date.now();

  do {
    if (isPrime(n)) {
      primes.push(n);
    }

    n++;
  } while (primes.length < maxCount);

  const end = Date.now();

  context.res = {
      status: 200,
      body: { time: end - start },
  };

  context.done();
};
