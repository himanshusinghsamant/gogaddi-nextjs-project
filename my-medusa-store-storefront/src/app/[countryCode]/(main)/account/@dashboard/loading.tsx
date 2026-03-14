export default function Loading() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-6">
      <div className="h-9 w-48 bg-slate-200 rounded-lg animate-pulse" />
      <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
      <div className="mt-8 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
