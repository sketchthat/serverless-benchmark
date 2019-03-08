exports.handler = function(event, context, callback) {
  let n = 0;
  const maxCount = 500000;
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

  callback(null, { statusCode: 200, body: JSON.stringify({ time: end - start }) });
};
