export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-36 rounded bg-[#181B21] border border-[#2A2D34]" />
        <div className="h-10 w-64 rounded-lg bg-[#181B21] border border-[#2A2D34]" />
        <div className="h-4 w-80 rounded bg-[#181B21]/60" />
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-28 rounded-xl bg-[#111318] border border-[#2A2D34]" />
        <div className="h-28 rounded-xl bg-[#111318] border border-[#2A2D34]" />
        <div className="h-28 rounded-xl bg-[#111318] border border-[#2A2D34]" />
      </div>

      {/* List Area Skeleton */}
      <div className="rounded-xl bg-[#111318] border border-[#2A2D34] p-6 space-y-4">
        <div className="h-6 w-48 rounded bg-[#181B21]" />
        <div className="space-y-3 pt-2">
          <div className="h-20 rounded-lg bg-[#181B21]" />
          <div className="h-20 rounded-lg bg-[#181B21]" />
          <div className="h-20 rounded-lg bg-[#181B21]" />
        </div>
      </div>
    </div>
  );
}
