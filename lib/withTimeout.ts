// Resolves with `fallback` if `promise` doesn't settle within `ms` ms.
// Used to guard server-side data fetches so a stalled network connection can
// never freeze a page render — we fall back to empty content instead.
export function withTimeout<T>(promise: PromiseLike<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([
    Promise.resolve(promise).then((v) => {
      clearTimeout(timer);
      return v;
    }),
    timeout,
  ]);
}
