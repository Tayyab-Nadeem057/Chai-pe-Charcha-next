// Shown instantly while an admin page loads its data — makes navigation feel snappy.
export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-5 h-7 w-40 rounded bg-white/5" />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-white/5" />
    </div>
  );
}
