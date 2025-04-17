
/**
 * Takes a promise-returning function and calls it, returning a promise
 * that can be awaited in the same way as the original function
 * 
 * @param fn The function to execute
 * @param timeout Timeout in milliseconds (default: 10000)
 * @returns A promise that resolves to the return value of the function
 */
export const withTimeout = <T>(
  fn: () => Promise<T>,
  timeout: number = 10000
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, timeout);

    fn().then(
      (result) => {
        clearTimeout(timeoutId);
        resolve(result);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
};
