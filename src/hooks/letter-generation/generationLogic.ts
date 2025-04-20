
export const setupGenerationTimeout = (
  timeoutMs: number = 45000,
  onTimeout: () => void
) => {
  const timeoutId = setTimeout(onTimeout, timeoutMs);
  return timeoutId;
};
