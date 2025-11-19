/**
 * retry-simple
 * A lightweight, flexible retry utility for async operations.
 *
 * Features:
 * - Fixed or exponential backoff
 * - Optional jitter to avoid retry storms
 * - Per-attempt timeout
 * - Maximum delay cap
 * - Custom retry conditions and hooks
 */

export interface RetryOptions {
  /** Maximum number of retry attempts (excluding the initial try). */
  retries?: number;

  /** Initial delay between retries in milliseconds. */
  delay?: number;

  /** Whether to use exponential backoff (delay doubles after each attempt). */
  backoff?: boolean;

  /** Whether to randomize delay (±20%) to prevent retry storms. */
  jitter?: boolean;

  /** Maximum delay allowed (useful when backoff=true). */
  maxDelay?: number;

  /** Timeout per attempt in milliseconds (abort if operation too slow). */
  timeout?: number;

  /** Callback executed after each failed attempt before retrying. */
  onRetry?: (error: unknown, attempt: number) => void;

  /** Custom condition to decide whether to retry based on error/attempt. */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/**
 * Retry an asynchronous function with customizable options.
 * @param fn The async function to execute.
 * @param options RetryOptions (see interface above).
 * @returns The resolved value of the async function.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    retries = 3,
    delay = 1000,
    backoff = false,
    jitter = false,
    maxDelay,
    timeout,
    onRetry,
    shouldRetry = () => true,
  } = options;

  let attempt = 0;
  let currentDelay = delay;

  while (attempt <= retries) {
    // <= because first attempt + retries
    try {
      attempt++;
      // Wrap function with timeout if specified
      const result = timeout
        ? await Promise.race([
            fn(),
            new Promise<never>((_, reject) =>
              setTimeout(
                () => reject(new Error("Operation timed out")),
                timeout
              )
            ),
          ])
        : await fn();

      return result; // success, return immediately
    } catch (error) {
      const isLastAttempt = attempt > retries; // if no more retries left

      // Decide if we should retry
      const canRetry = !isLastAttempt && shouldRetry(error, attempt);
      if (!canRetry) throw error;

      // Only log if there is a retry
      onRetry?.(error, attempt);

      // Compute next delay
      let waitTime = currentDelay;

      if (backoff) waitTime *= 2; // exponential growth
      if (maxDelay && waitTime > maxDelay) waitTime = maxDelay; // cap delay
      if (jitter) {
        const randomFactor = Math.random() * 0.4 + 0.8; // random ±20%
        waitTime *= randomFactor;
      }

      // Wait before next attempt
      await new Promise((r) => setTimeout(r, waitTime));

      currentDelay = waitTime; // carry forward for exponential series
    }
  }

  throw new Error("Retry attempts exhausted.");
}
