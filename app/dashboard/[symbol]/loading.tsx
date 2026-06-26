import { Skeleton } from "@/components/ui/skeleton";

export default function SymbolLoading() {
  return (
    <div className="space-y-6" dir="rtl">
      <Skeleton className="h-12 w-80 rounded-2xl" />
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Skeleton className="h-56 rounded-[2rem]" />
          <Skeleton className="h-72 rounded-[2rem]" />
          <Skeleton className="h-64 rounded-[2rem]" />
        </div>
        <Skeleton className="h-64 rounded-[2rem]" />
      </div>
    </div>
  );
}
