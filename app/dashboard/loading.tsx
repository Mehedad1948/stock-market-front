import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-4" dir="rtl">
      <Skeleton className="h-64 rounded-[2rem] bg-black/6" />
      <Skeleton className="h-[28rem] rounded-[2rem] bg-black/6" />
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-40 rounded-[2rem] bg-black/6"
          />
        ))}
      </div>
    </div>
  );
}
