import { Skeleton } from "@/components/ui/skeleton";

export default function SymbolLoading() {
  return (
    <div className="space-y-4" dir="rtl">
      <Skeleton className="h-64 rounded-[2rem] bg-black/6" />
      <div className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-72 rounded-[2rem] bg-black/6" />
        <Skeleton className="h-72 rounded-[2rem] bg-black/6" />
        <Skeleton className="h-72 rounded-[2rem] bg-black/6" />
      </div>
      <Skeleton className="h-80 rounded-[2rem] bg-black/6" />
    </div>
  );
}
