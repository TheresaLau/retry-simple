# 📘 More Examples — retry-simple

This document provides additional **usage examples** of `retry-simple` for both **TypeScript** and **JavaScript** users.

---

## Contents

- [📘 More Examples — retry-simple](#-more-examples--retry-simple)
  - [Contents](#contents)
  - [TypeScript Examples](#typescript-examples)
  - [1. Basic Retry](#1-basic-retry)
  - [2. Exponential Backoff with Jitter](#2-exponential-backoff-with-jitter)
  - [3. Exponential Backoff with a Max Delay Cap](#3-exponential-backoff-with-a-max-delay-cap)
  - [4. Timeout per Attempt](#4-timeout-per-attempt)
  - [5. Custom Retry Condition](#5-custom-retry-condition)
  - [6. Using onRetry Hook](#6-using-onretry-hook)
  - [JavaScript](#javascript)
  - [🏁 Summary](#-summary)

---

## TypeScript Examples

## 1. Basic Retry

```ts
import { retry } from "retry-simple";

let attempt = 0;

async function unstableOperation() {
  attempt++;
  console.log("Running attempt", attempt1);
  if (attempt < 3) throw new Error(`Failed attempt ${attempt}`);
  return "✅ Success on attempt " + attempt;
}

const result = await retry(unstableOperation, { retries: 5, delay: 500 });
console.log(result);
```

Output:

```bash
Running attempt 1
Running attempt 2
Running attempt 3
✅ Success on attempt 3
```

## 2. Exponential Backoff with Jitter

```ts
import { retry } from "retry-simple";

let attempt = 0;

async function unstableNetworkRequest() {
  attempt++;
  if (attempt < 4) throw new Error(`Network error on attempt ${attempt}`);
  return "🌐 Connected on attempt " + attempt;
}

const result = await retry(unstableNetworkRequest, {
  retries: 5,
  delay: 500,
  backoff: true,
  jitter: true,
  onRetry: (err, attempt) =>
    console.warn(`Attempt ${attempt} failed: ${(err as Error).message}. Retrying...`)
});

console.log(result);
```

Output:

```bash
Attempt 1 failed: Network error on attempt 1. Retrying...
Attempt 2 failed: Network error on attempt 2. Retrying...
Attempt 3 failed: Network error on attempt 3. Retrying...
🌐 Connected on attempt 4
```

## 3. Exponential Backoff with a Max Delay Cap

```ts
import { retry } from "retry-simple";

let attempt = 0;

async function flakyAPI() {
  attempt++;
  if (attempt < 5) throw new Error(`Server busy (${attempt})`);
  return "✅ Request succeeded!";
}

const result = await retry(flakyAPI, {
  retries: 6,
  delay: 500,
  backoff: true,
  maxDelay: 2000, // cap delay to avoid too long wait
  onRetry: (err, attempt) =>
    console.log(`Attempt ${attempt} failed: ${(err as Error).message}. Retrying...`)
});

console.log(result);
```

Output:

```bash
Attempt 1 failed: Server busy (1). Retrying...
Attempt 2 failed: Server busy (2). Retrying...
Attempt 3 failed: Server busy (3). Retrying...
Attempt 4 failed: Server busy (4). Retrying...
✅ Request succeeded!
```

> ⏳ Delay increases exponentially but never exceeds 2000 ms.

## 4. Timeout per Attempt

```ts
import { retry } from "retry-simple";

async function slowTask() {
  await new Promise(r => setTimeout(r, 2000));
  return "Done";
}

await retry(slowTask, { retries: 2, timeout: 1000 });
// → throws "Operation timed out"
```

Output:

```bash
Error: Operation timed out
```

> Each attempt times out after 1000 ms; the retry process stops once all attempts are exhausted.

## 5. Custom Retry Condition

```ts
import { retry } from "retry-simple";

let attempt = 0;

async function task() {
  attempt++;
  if (attempt < 4) throw new Error("Temporary error");
  return "✅ Done";
}

await retry(task, {
  retries: 5,
  shouldRetry: (error, attempt) => {
    console.log("Checking retry condition for attempt:", attempt);
    return !(error instanceof TypeError);
  }
});
```

Output:

```bash
Checking retry condition for attempt: 1
Checking retry condition for attempt: 2
Checking retry condition for attempt: 3
✅ Done
```

## 6. Using onRetry Hook

```ts
import { retry } from "retry-simple";

await retry(async () => {
  throw new Error("Network error");
  }, {
    retries: 3,
    delay: 300,
    onRetry: (err, attempt) => {
      console.log(`Attempt ${attempt} failed: ${(err as Error).message}. Retrying...`);
  }
});
```

Output:

```bash
Attempt 1 failed: Network error. Retrying...
Attempt 2 failed: Network error. Retrying...
Attempt 3 failed: Network error. Retrying...
```

---

## JavaScript

> 💡 **Note for JavaScript users:**  
> All examples above work the same in JavaScript.  
> Just replace the TypeScript import with:
>
> ```js
> const { retry } = require("retry-simple");
> ```
>
> and also,
>
> ```js
> onRetry: (err, attempt) => {
>  console.log(`Retry ${attempt} due to: ${err.message}`); // JS: no cast needed
> }
> ```
>

---

## 🏁 Summary

`retry-simple` provides a lightweight, reliable way to handle async retries with configurable logic, delays, and error control — built for both Node.js and TypeScript environments.

🔗 **Resources**  

- **GitHub:** [TheresaLau/retry-simple](https://github.com/TheresaLau/retry-simple)  

- **npm:** [retry-simple on npm](https://www.npmjs.com/package/retry-simple)

---

© 2025 Theresa Lau — Released under the [MIT License](https://github.com/TheresaLau/retry-simple/blob/main/LICENSE)
