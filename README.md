# retry-simple

A lightweight and flexible retry utility for asynchronous operations — built for Node.js and TypeScript.

[![npm version](https://img.shields.io/npm/v/retry-simple.svg)](https://www.npmjs.com/package/retry-simple)
[![npm downloads](https://img.shields.io/npm/dw/retry-simple.svg)](https://www.npmjs.com/package/retry-simple)
[![license](https://img.shields.io/npm/l/retry-simple.svg)](https://github.com/TheresaLau/retry-simple/blob/main/LICENSE)

---

## ✨ Features

- 🔁 **Retry logic** with configurable attempts  
- ⏱️ **Per-attempt timeout**  
- 📈 **Exponential backoff** support  
- 🎲 **Jitter (±20%)** to avoid retry storms  
- 🚦 **Max delay cap** for controlled exponential growth  
- 🧩 **Custom retry conditions** (`shouldRetry`)  
- 🪝 **Retry hook** (`onRetry`) after each failed attempt  

---

## 🚀 Installation

```bash
npm install retry-simple
```

or using yarn:

```bash
yarn add retry-simple
```

## 🚀 Usage

### 🟦 TypeScript Example

```ts
import { retry } from "retry-simple";

let attempt = 0;

async function unstableOperation() {
  attempt++;
  if (attempt < 3) throw new Error(`Fail attempt ${attempt}`);
  return "✅ Success on attempt " + attempt;
}

const result = await retry(unstableOperation, {
  retries: 5,
  delay: 500,
  backoff: true,
  jitter: true,
  onRetry: (err, attempt) =>
    console.log(`Attempt ${attempt} failed: ${(err as Error).message}`)
});

console.log(result);
```

### 🟨 JavaScript Example (CommonJS)

```js
const { retry } = require("retry-simple");

let attempt = 0;

async function unstableOperation() {
  attempt++;
  if (attempt < 3) throw new Error(`Fail attempt ${attempt}`);
  return "✅ Success on attempt " + attempt;
}

retry(unstableOperation, {
  retries: 5,
  delay: 500,
  backoff: true,
  jitter: true,
  onRetry: (err, attempt) =>
    console.log(`Attempt ${attempt} failed: ${err.message}`)
})
  .then(console.log)
  .catch(console.error);
```

#### Output

```bash
Attempt 1 failed: Fail attempt 1
Attempt 2 failed: Fail attempt 2
✅ Success on attempt 3
```

➕ See more advanced examples in **[MORE_EXAMPLES.md](./MORE_EXAMPLES.md)**

## ⚙️ API Reference

### `retry(fn, options?)`

Runs an asynchronous function with automatic retry logic.

| Parameter | Type | Required | Description |
|------------|------|-----------|-------------|
| `fn` | `() => Promise<T>` | ✅ | The async function to execute. |
| `options` | [`RetryOptions`](#%EF%B8%8F-retry-options) | ❌ | Optional configuration (see below). |

### ⚙️ Retry Options

| Option | Type | Default | Description |
|:--------|:------|:----------|:-------------|
| `retries` | `number` | `3` | Maximum number of retry attempts (excluding the first try). |
| `delay` | `number` | `1000` | Initial delay between retries in milliseconds. |
| `backoff` | `boolean` | `false` | Doubles the delay after each failed attempt (exponential backoff). |
| `jitter` | `boolean` | `false` | Adds ±20% randomness to delay to prevent retry storms. |
| `maxDelay` | `number` | `undefined` | Maximum allowed delay between retries. |
| `timeout` | `number` | `undefined` | Timeout for each individual attempt (ms). |
| `onRetry` | `(error: unknown, attempt: number) => void` | `undefined` | Callback executed after each failed attempt before retrying. |
| `shouldRetry` | `(error: unknown, attempt: number) => boolean` | `() => true` | Custom logic to decide whether to continue retrying based on the error or attempt number. |

## 🏷️ Changelog

### v0.0.2

#### Initial functional release

- Added full retry configuration support:
  - `retries`, `delay`, `backoff`, `jitter`, `maxDelay`, `timeout`, `onRetry`, `shouldRetry`
- Added detailed documentation and usage guide

### v0.0.1

#### Initial placeholder release

- Reserved package name and project setup

---

## 🌟 Support

If you like this utility, consider giving it a ⭐ on [GitHub](https://github.com/TheresaLau/retry-simple)!  
Feedback and contributions are always welcome 🙌

---

© 2025 Theresa Lau — Released under the [MIT License](https://github.com/TheresaLau/retry-simple/blob/main/LICENSE)
