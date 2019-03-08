# Serverless Benchmark

- [Cold Start](#cold-start)
  - Information
  - Architecture
    - Amazon Web Services
    - Google Cloud Platform
    - Microsoft Azure
  - Trigger Function
  - Cold Start Function
  - Results
- [Prime Number Generator](#prime-number-generator)
  - Information
  - Architecture
    - Amazon Web Services
    - Google Cloud Platform
    - Microsoft Azure
  - Trigger Function
  - Prime Number Generator Function
  - Results

---

# Cold Start

## Information

Basic benchmark script calls serverless functions on _Amazon Web Services_, _Google Cloud Platform_ & _Microsoft Azure_.

The results of the tests will show us on average how long a function takes to cold start and warm start depending on the provider.

The functions are simple and don't have any external dependencies so time to completion should be quick.

There are six functions setup on each provider, each called every 6 hours.

- `coldStart0` - `00:00`, `06:00`, `12:00`, `18:00`
- `coldStart1` - `01:00`, `07:00`, `13:00`, `19:00`
- `coldStart2` - `02:00`, `08:00`, `14:00`, `20:00`
- `coldStart3` - `03:00`, `09:00`, `15:00`, `21:00`
- `coldStart4` - `04:00`, `10:00`, `16:00`, `22:00`
- `coldStart5` - `05:00`, `11:00`, `17:00`, `23:00`

Rotating between `coldStartN` gives the function time to cool down, allowing a cold start for the next request 6 hours later.

The functions are also called on a warm start 15 minutes after the cold start request.

- `coldStart0` - `00:15`, `06:15`, `12:15`, `18:15`
- `coldStart1` - `01:15`, `07:15`, `13:15`, `19:15`
- `coldStart2` - `02:15`, `08:15`, `14:15`, `20:15`
- `coldStart3` - `03:15`, `09:15`, `15:15`, `21:15`
- `coldStart4` - `04:15`, `10:15`, `16:15`, `22:15`
- `coldStart5` - `05:15`, `11:15`, `17:15`, `23:15`

The latency of each call is tracked and recorded. It's been architected to limit round-trip time and focus on boot latency.

Each provider has it's own trigger function which calls and monitors the `coldStartN` response.

## Architecture

### Amazon Web Services
![AWS](./assets/AWS.png)

### Google Cloud Platform
![GCP](./assets/GCP.png)

### Microsoft Azure
![Azure](./assets/Azure.png)

## Trigger Function

Trigger function is called from an external scheduler. The trigger function calls the coldStart function, this ensures the bandwidth latency isn't adding extra time to the boot results.

_Azure Example_
```javascript
module.exports = async (context, _req) => {
  const https = require('https');

  const ref = await new Promise((resolve, _reject) => {
    const date = new Date();
    const hour = date.getHours();

    const options = {
      host: 'functionAddress.azurewebsites.net',
      path: `/api/functionName${hour%6}`,
      port: 443,
    };

    const response = {
      service: 'azure',
      status: 0,
      latency: null,
      date: null,
      uri: `https://${options.host}${options.path}`,
    };

    const start = Date.now();

    https.get(options, resp => {
      response.status = resp.statusCode;

      let data = '';

      resp.on('data', chunk => {
        data += chunk;
      });

      resp.on('end', () => {
        const end = Date.now();

        response.latency = end - start;

        if (data) {
          const jsonResponse = JSON.parse(data);

          response.date = jsonResponse.date;
        }

        resolve(response);
      });
    })
    .on('error', _err => {
      const end = Date.now();

      response.latency = end - start;

      resolve(response);
    });
  });

  context.res = { body: ref };
  context.done();
};
```

## Cold Start Function

The function itself is fairly simple, there are no external dependencies and the function simply returns the current timestamp.

_Azure Example_
```javascript
module.exports = (context, _req) => {
    const date = Date.now();

    context.res = {
        body: {
            date,
        }
    };

    context.done();
};
```

## Results

TBA

# Prime Number Generator

The prime number generator calculates the first 500,000 prime numbers in a non-efficient loop process.

The function will be called every 15 minutes to ensure it stays warm.

The latency of each call is tracked and recorded. It's been architected to limit round-trip time and focus on boot latency.

Each provider has it's own trigger function which calls and monitors the `primeNumber` response.

## Architecture

### Amazon Web Services
![AWS](./assets/AWS.png)

### Google Cloud Platform
![GCP](./assets/GCP.png)

### Microsoft Azure
![Azure](./assets/Azure.png)

## Trigger Function

Trigger function is called from an external scheduler. The trigger function calls the Prime Number function, this ensures the bandwidth latency isn't adding extra time to the boot results.

_Azure Example_
```javascript
module.exports = async (context, _req) => {
  const https = require('https');

  const ref = await new Promise((resolve, _reject) => {
    const date = new Date();
    const hour = date.getHours();

    const options = {
      host: 'functionAddress.azurewebsites.net',
      path: `/api/primeNumberGenerator`,
      port: 443,
    };

    const response = {
      service: 'azure',
      status: 0,
      latency: null,
      date: null,
      uri: `https://${options.host}${options.path}`,
    };

    const start = Date.now();

    https.get(options, resp => {
      response.status = resp.statusCode;

      let data = '';

      resp.on('data', chunk => {
        data += chunk;
      });

      resp.on('end', () => {
        const end = Date.now();

        response.latency = end - start;

        if (data) {
          const jsonResponse = JSON.parse(data);

          response.date = jsonResponse.date;
        }

        resolve(response);
      });
    })
    .on('error', _err => {
      const end = Date.now();

      response.latency = end - start;

      resolve(response);
    });
  });

  context.res = { body: ref };
  context.done();
};
```

## Prime Number Generator Function

The function simply loops through a `do/while` loop until it's calculated the first 500,000 prime numbers and thrown them into an array.

_Azure Example_
```javascript
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
```

## Results

TBA

