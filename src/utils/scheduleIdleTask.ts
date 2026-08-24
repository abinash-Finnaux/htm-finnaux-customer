type IdleWindow = {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function scheduleIdleTask(
  task: () => void,
  timeout = 200,
): () => void {
  const g = globalThis as IdleWindow;

  if (typeof g.requestIdleCallback === 'function') {
    const handle = g.requestIdleCallback(task, { timeout });
    return () => {
      g.cancelIdleCallback?.(handle);
    };
  }

  const immediateId = setImmediate(task);
  return () => {
    clearImmediate(immediateId);
  };
}
